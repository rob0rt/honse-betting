import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: LayoutServerLoad = async (event) => {
	const race = await prisma.race.findFirst({
		include: {
			horses: {
				include: {
					horse: true
				}
			}
		}
	});

	return {
		user: event.locals.user!,
		race
	};
};
