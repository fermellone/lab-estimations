import { error, type ServerLoad } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { Project, Request, Epic } from '$lib/types';

export const load: ServerLoad = async ({ params }) => {
	return {
		project: await getProject(Number(params.projectId)),
		request: await getRequest(Number(params.requestId)),
		epics: await getEpics(Number(params.projectId))
	};
};

const getRequest = async (projectId: number) => {
	const request: Request = await prisma.request.findUnique({
		where: {
			id: projectId
		},
		select: {
			id: true,
			title: true,
			description: true
		}
	});
	if (!request) {
		throw error(404, { message: 'Project not found' });
	}
	console.log('Server load...');
	console.log(`Proyecto: ${request.title}`);
	return request;
};

const getProject = async (requestId: number) => {
	const project: Project = await prisma.project.findUnique({
		where: {
			id: requestId
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
	console.log('Server load...');
	console.log(`Proyecto: ${project.title}`);
	return project as Project;
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
