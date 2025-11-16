import { query } from "$app/server";
import * as v from 'valibot';
import { PrismaClient } from "$lib/prisma/client";
import { DATABASE_URL } from '$env/static/private'

export const getUser = query(v.string(), async (accessToken) => {
    const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const { id } = await response.json();

    const prisma = new PrismaClient({
        datasourceUrl: DATABASE_URL
    });
    const user = await prisma.user.upsert({
        where: { id },
        update: {},
        create: {
            id,
        }
    });

    const bets = await prisma.bet.findMany({
        where: { userId: user.id },
    });

    return {
        user,
        bets,
    }
});