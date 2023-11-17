import { Prisma } from "@prisma/client";
import Elysia from "elysia";
import { prismaService } from "../integrations/prismaService";
import { authModel } from "./authModel";

type CreateUserByEmailData = Omit<Prisma.UserCreateInput, "keys" | "id" | "auth_sessions"> & { password: string };

const include = {
    auth_sessions: { take: 1 }
} as const satisfies Prisma.UserCreateArgs['include'];

const idleTime = 1000 * 60 * 60 * 24 * 7;
const invalidTime = 1000 * 60 * 60 * 24 * 7;

export const authService = new Elysia()
    .use(prismaService)
    .use(authModel)

    .derive(({ prisma }) => ({

        createUserByOauth: async ({ provider, id_from_provider, ...userData }: Prisma.UserCreateInput & {
            provider: string;
            id_from_provider: string;
        }) => {
            const { auth_sessions: [auth_session], ...user } = await prisma.user.create({
                data: {
                    ...userData,
                    keys: {
                        connect: {
                            provider_id_from_provider: {
                                provider,
                                id_from_provider
                            }
                        }
                    },
                    auth_sessions: { create: {} }
                },
                include
            });
            return { auth_session, user };
        },

        createUserByEmail: async ({ password, ...userData }: CreateUserByEmailData) => {

            await prisma.key.create({
                data: {
                    id_from_provider: userData.email,
                    provider: "email",
                    hashed_password: await Bun.password.hash(password)
                }
            });

            const { auth_sessions: [auth_session], ...user } = await prisma.user.create({
                data: {
                    ...userData,
                    keys: {
                        connect: {
                            provider_id_from_provider: {
                                provider: "email",
                                id_from_provider: userData.email
                            }
                        }
                    },
                    auth_sessions: { create: {} }
                },
                include: { auth_sessions: { take: 1 } }
            });
            return { auth_session, user };
        },

        loginByEmail: async ({ password, email }: { password: string, email: string }) => {
            const res = await prisma.key.findFirst({
                where: { user: { email }, provider: "email" },
                select: { hashed_password: true }
            });

            if (!res) throw new Error("Invalid email");
            const { hashed_password } = res;

            if (await Bun.password.verify(hashed_password!, password))
                throw new Error("Invalid password");

            const { auth_sessions: [auth_session], ...rest } = await prisma.user.update({
                where: { email },
                data: { auth_sessions: { create: {} } },
                include
            });
            return { auth_session, user: rest };
        },

        logOut: async (currentSession: { id: string }) => {
            await prisma.session.delete({ where: { id: currentSession.id } });
            // delete cookie.session.value;
        },

        checkSession: async (currentSession: {
            id: string;
            user_id: string;
            created_at: Date;
        }) => {
            // Check if session is invalid.
            if (currentSession.created_at.getUTCSeconds() + invalidTime < Date.now()) throw new Error("Session expired");

            // Check if session is idle and needs to be updated.
            if (currentSession.created_at.getUTCSeconds() + idleTime < Date.now())
                return await prisma.session
                    .update({ where: { id: currentSession.id }, data: { created_at: new Date() } })
                    .catch(e => { if (e) throw new Error("Session invalid") })

            // Current session is valid.
            return currentSession;
        }
    }))