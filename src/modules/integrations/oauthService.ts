import oauth2, { InferContext, github } from "@bogeychan/elysia-oauth2";
import { randomBytes } from "crypto";
import Elysia, { NotFoundError } from "elysia";
import { prismaService } from "./prismaService";

const oauthHelper = new Elysia({ name: 'oauthHelper' })
    .use(prismaService)

    .state({
        states: {} as Record<string, string[]>
    })
    .derive(({ store }) => ({
        stateStore: store.states,
    }))
    // TODO define this cookie at login page
    .derive(({ cookie: { oauthSession } }) => ({
        getCurrentUserId: () => {
            if (!oauthSession.value || !oauthSession.value.user_id) throw new Error("No oauth session found.");
            console.log("Found.");
            return oauthSession.value.user_id as string;
        }
    }))

type HelperCtx = InferContext<typeof oauthHelper>;

export const oauthService = new Elysia({ name: 'oauthService' })
    .use(oauthHelper)
    .use(oauth2({
        // redirect to this page after successful login
        redirectTo: '/register',

        // define multiple OAuth 2.0 profiles
        profiles: {
            github: { provider: github(), scope: ['user'] }
        },

        // custom state verification between requests
        // state is a random, unguessable, **ephemeral** string used to prevent CSRF attacks
        state: {
            generate: ({ stateStore }: HelperCtx, name) => {
                const newState = randomBytes(8).toString('hex');
                stateStore![name] === undefined
                    ? stateStore![name] = [newState]
                    : stateStore![name].push(newState);
                return newState;
            },
            check: ({ stateStore }: HelperCtx, name, state) => {
                const stateExists = stateStore![name]?.includes(state) ?? false;
                if (!stateExists) return false;
                stateStore![name] = stateStore![name]?.filter(s => s !== state);
                if (stateStore![name]?.length === 0) delete stateStore![name];
                return true;
            }
        },

        // define storage of users' access tokens
        // access tokens are used to authenticate requests to protected resources
        // in our case, we use them to authenticate requesting a user's profile from the OAuth 2.0 provider, 
        // after which we can create a session for the user and discard the access token
        storage: {
            set: async ({ prisma, getCurrentUserId }: HelperCtx, name, { scope, ...token }) => {
                const uuid = getCurrentUserId!();
                console.log('Storing token:', name, uuid);
                const scopes = { create: scope instanceof Array ? scope.map(name => ({ name })) : [{ name: scope }] }

                // delete all scopes associated with this token before storing new ones
                await prisma!.scopes.deleteMany({ where: { token: { uuid } } });

                const res = await prisma!.tOAuth2AccessToken.upsert({
                    where: { uuid },
                    update: { scopes, ...token },
                    // or...
                    create: { name, uuid, ...token, scopes, }
                });
                console.log("Token stored:", res);
            },

            get: async ({ prisma, getCurrentUserId }: HelperCtx, name) => {
                const uuid = getCurrentUserId!();
                console.log('get token for user:', uuid);
                const res = await prisma!.tOAuth2AccessToken.findFirst({
                    where: { name, uuid },
                    include: { scopes: true }
                })
                console.log('result:', res);
                if (!res) return undefined;
                const { scopes, ...token } = res;
                return { scope: scopes.map(({ name }) => name), ...token };
            },

            delete: ({ prisma, getCurrentUserId }: HelperCtx, name) => {
                console.log('delete', name);
                const uuid = getCurrentUserId!();
                prisma!.tOAuth2AccessToken.delete({
                    where: { uuid }
                });
            }
        }
    }))
    .derive(({ profiles, authorized, tokenHeaders, prisma, set }) => {

        const getAuthorizedProvider = async () => {
            type Profile = keyof ReturnType<typeof profiles>;
            const profile = await Object.keys(profiles()).reduce(async (acc, profileUntyped) => {
                if ((await acc) !== null) return acc;

                const profile = profileUntyped as Profile;
                console.log("Checking", profile, "for valid token.");

                // Check if the current user, based on the current oauth session, is authorized to fetch user data from this profile.
                const authorizedProfile = await authorized(profile);
                console.log(profile, authorizedProfile
                    ? "authorized. can fetch a user."
                    : "not authorized."
                );
                if (authorizedProfile) return profile;
                return acc;
            }, Promise.resolve(null) as Promise<Profile | null>);

            if (!profile) throw new NotFoundError("No authorized profile found.");

            return profile;
        };

        const urlMap = {
            "github": "https://api.github.com/user"
        } satisfies { [K in keyof ReturnType<typeof profiles>]: string };

        const getAuthenticatedUser = async (): Promise<
            | {
                provider: "github", user: {
                    id: number,
                    email?: string,
                    name: string
                }
            }

        // TODO add user types for other providers
        > => {
            const provider = await getAuthorizedProvider();
            const headers = await tokenHeaders(provider);
            const user = await fetch(urlMap[provider], { headers })
                .then(async res => {
                    if (!res.ok) throw new NotFoundError(`Failed to fetch user from ${provider}: ${res.statusText}`);
                    const out = await res.json();
                    console.log("User from github:", out);
                    return out;
                });
            return { provider, user };
        }

        const storeAuthenticatedUser = async () => {
            const { provider, user: userStub } = await getAuthenticatedUser();

            if (provider === "github") {
                const { id, email, name } = userStub;
                const id_from_provider = id.toString();

                // Create key if not exists, don't error if it does
                const key = await prisma!.key.upsert({
                    where: { provider_id_from_provider: { provider, id_from_provider } },
                    create: { provider, id_from_provider, },
                    update: {}
                });

                // If key exists, check for user. If user exists, return user.
                const foundUser = await prisma!.user.findFirst({
                    where: { keys: { some: { provider, id_from_provider } } }
                });

                if (foundUser) return { user: foundUser };

                const [firstName, ...rest] = name.split(" ");
                const lastName = rest.join(" ");

                // If key exists, but user does not, check if user can be created with the given info.
                // If not, return key and user object as stub, so user can provide missing info.
                if (!(email && firstName && lastName)) return { key, user: { email, firstName, lastName } };

                // Create user
                const createdUser = await prisma!.user.create({
                    data: { email, firstName, lastName }
                });

                return { user: createdUser };
            }

            throw new Error(`Unknown provider: ${provider}`);
        };

        const onOauthReturn = async () => {
            const { key, user } = await storeAuthenticatedUser();

            // If a key was created, but not a user, redirect to signup page to collect required signup info.
            // Also set oauth cookie to store key.
            if (key) {
                const { provider, id_from_provider } = key;
                console.log("Key created", "User will register remaining info.");
                return { stub: { ...user, id_from_provider, provider } }
            }

            // If a user was found/created, grant session token to user.
            const session = await prisma.session.create({
                data: { user_id: user.id }
            });

            set.cookie = {
                session: {
                    value: JSON.stringify(session),
                    path: "/"
                }
            };

            console.log("Session granted:", session);
            return {
                /**
                 * If session is granted, redirect to user landing page.
                 */
                redirectResponse: Response.redirect("/")
            }
        }

        return { onOauthReturn };
    })