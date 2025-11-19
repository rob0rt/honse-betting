import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent }) => {
	const { race, user } = await parent();

	if (!race) {
		throw redirect(302, '/');
	}

	return { race, user };
};
