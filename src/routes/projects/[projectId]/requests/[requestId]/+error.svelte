<script>
	import { page } from '$app/stores';
</script>

{#await page}
	<div>loading...</div>
{:then page}
	{#if page.error}
		<div class="error">
			<h1>{page.error.status}</h1>
			<p>{page.error.message}</p>
		</div>
	{/if}
{/await}
