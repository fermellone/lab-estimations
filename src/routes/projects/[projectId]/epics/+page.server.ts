import type { Epic } from '$lib/types';
import { error, fail, type Actions, type ServerLoad } from '@sveltejs/kit';

import { prisma } from '$lib/server/prisma';

export const load: ServerLoad = async ({ params }) => {
	return {
		epics: await getEpics(Number(params.projectId))
	};
};

const getEpics = async (projectId: number) => {
	try {
		const epics: Epic[] = await prisma.epic.findMany({
			where: {
				projectId: projectId,
				deleteStatus: false
			},
			select: {
				id: true,
				title: true,
				tag: true,
				projectId: true
			}
		});
		if (!epics) {
			throw error(404, { message: 'Epics not found' });
		}
		return epics;
	} catch (err) {
		console.error(err);
		throw error(500, { message: 'Error getting epics' });
	}
};

export const actions: Actions = {
	create: async ({ request, params }) => {
		const { title, color } = Object.fromEntries(await request.formData()) as {
			title: string;
			color: string;
		};

		try {
			await prisma.epic.create({
				data: {
					title,
					tag: color,
					projectId: Number(params.projectId)
				}
			});
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'Could not create the epic.' });
		}

		return {
			status: 201
		};
	}
};
