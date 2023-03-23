import { error, fail, type Actions, type ServerLoad } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { Project, Color, Epic, Request, Issue } from '$lib/types';

export const load: ServerLoad = async ({ params }) => {
	const requests = await getRequests(Number(params.projectId));
	// por cada request, buscar los issues y agregarlos a la request
	for (let i = 0; i < requests.length; i++) {
		const issues = await getIssues(requests[i].id);
		requests[i].issues = issues;
	}

	return {
		project: await getProject(Number(params.projectId)),
		epics: await getEpics(Number(params.projectId)),
		requests: requests
	};
};

const getIssues = async (requestId: number) => {
	const issues: Issue[] = await prisma.issue.findMany({
		where: {
			requestId: requestId,
			deleteStatus: false
		},
		select: {
			id: true,
			title: true,
			timeForEstimation: true,
			estimation: true
		}
	});

	if (!issues) {
		return [];
	} else {
		return issues;
	}
};

const getProject = async (projectId: number) => {
	const project: Project = await prisma.project.findUnique({
		where: {
			id: projectId
		},
		select: {
			id: true,
			title: true,
			description: true
		}
	});
	if (!project) {
		throw error(404, { message: 'Project not found' });
	}
	return project;
};

const getEpics = async (projectId: number) => {
	const epics: Epic[] = await prisma.epic.findMany({
		where: {
			projectId: projectId,
			deleteStatus: false
		},
		select: {
			id: true,
			title: true,
			tag: true
		}
	});
	if (!epics) {
		throw error(404, { message: 'Epic not found' });
	}
	return epics;
};

async function getRequests(projectId: number) {
	const requests: Request[] = await prisma.request.findMany({
		where: {
			projectId: projectId,
			deleteStatus: false
		},
		select: {
			id: true,
			title: true,
			description: true,
			issues: true,
			epicId: true
		}
	});
	if (!requests) {
		throw error(404, { message: 'Requests not found' });
	}
	return requests;
}

export const actions: Actions = {
	'update-project': async ({ request, params }) => {
		const { title, description } = Object.fromEntries(await request.formData()) as {
			title: string;
			description: string;
		};

		try {
			await prisma.project.update({
				where: {
					id: Number(params.projectId)
				},
				data: {
					title,
					description
				}
			});
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'Could not update the project' });
		}
		return {
			status: 201
		};
	},
	'create-epic': async ({ request, params }) => {
		const { title, color } = Object.fromEntries(await request.formData()) as {
			title: string;
			color: Color;
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
	},
	'create-request': async ({ request, params }) => {
		const { title, description, epic } = Object.fromEntries(await request.formData()) as {
			title: string;
			description: string;
			epic: string;
		};

		try {
			await prisma.request.create({
				data: {
					title,
					description,
					projectId: Number(params.projectId),
					epicId: Number(epic)
				}
			});
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'Could not create the request.' });
		}

		return {
			status: 201
		};
	}
};
