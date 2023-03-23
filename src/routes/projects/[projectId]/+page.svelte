<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import type { Request } from '$lib/types';
	import {
		Badge,
		Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	export let data: PageData;
	$: ({ project, epics, requests } = data);

	// por cada request, obtener los issues y luego la supa de todas las estimaciones de los issues y de todos los timeForEstimations de los issues

	// obtener la sumatoria de todas las estimaciones + sumatoria de todos los timeForEstimations de los issues
	$: totalEstimation = requests.reduce((acc, request) => {
		const issues = request.issues;
		const estimation = issues.reduce((acc, issue) => acc + issue.estimation, 0);
		return acc + estimation;
	}, 0);
	$: totalTimeForEstimation = requests.reduce((acc, request) => {
		const issues = request.issues;
		const timeForEstimation = issues.reduce((acc, issue) => acc + issue.timeForEstimation, 0);
		return acc + timeForEstimation;
	}, 0);

	console.log(totalEstimation);
	console.log(totalTimeForEstimation);

	const onDelete = async (request: Request) => {
		const response = await confirm('Are you sure you want to delete this project?');

		if (response) {
			await fetch(`/api/projects?id=${project.id}`, {
				method: 'DELETE'
			});
			goto('/projects');
		}
	};
</script>

<main class="container">
	<h1>
		{project.title}
		<a href="/projects/{project.id}/edit">Edit</a>
		<p class="text-sm">{project.description}</p>
	</h1>

	<div class="">
		{#each epics as epic}
			<Badge class=" px-2 mx-1" color={epic.tag}>{epic.title}</Badge>
		{/each}
		<div class="py-2">
			<Button
				on:click={() => {
					goto(`/projects/${project.id}/epics`);
				}}
				size="xs"
				class="w-28">Go to Epics</Button
			>
		</div>
	</div>

	<div>
		<Button
			on:click={() => {
				goto(`${project.id}/requests/create`);
			}}>Add a new Request</Button
		>
	</div>

	<Table striped={true}>
		<TableHead>
			<TableHeadCell>Requests</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each requests as request}
				<TableBodyRow>
					<TableBodyCell
						class="cursor-pointer"
						on:click={() => {
							goto(`${project.id}/requests/${request.id}`);
						}}
					>
						<span>
							{request.title}
						</span>
					</TableBodyCell>

					<TableBodyCell>
						{#each epics as epic}
							{#if epic.id == request.epicId}
								<Badge class=" px-2 mx-1" color={epic.tag}>{epic.title}</Badge>
							{/if}
						{/each}
					</TableBodyCell>

					<TableBodyCell>
						<span>{request.description}</span>
					</TableBodyCell>

					<TableBodyCell>
						<button
							on:click={() => {
								goto(`${project.id}/requests/${request.id}/edit`);
							}}>Edit</button
						>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</main>
