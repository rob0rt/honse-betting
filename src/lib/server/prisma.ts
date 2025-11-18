import { DATABASE_URL } from '$env/static/private';
import { PrismaClient } from '$lib/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

export const prisma = new PrismaClient({
	adapter: new PrismaNeon({
		connectionString: DATABASE_URL
	})
});
