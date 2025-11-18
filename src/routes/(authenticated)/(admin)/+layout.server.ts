import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user?.admin) {
		throw redirect(303, '/');
	}

	return {
		user: event.locals.user!
	};
};
