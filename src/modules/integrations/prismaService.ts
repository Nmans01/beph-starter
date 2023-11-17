import { PrismaClient } from "@prisma/client"
import Elysia from "elysia"

const prisma = new PrismaClient()

export const prismaService = new Elysia({ name: "prismaService"})
    .decorate({ prisma })
