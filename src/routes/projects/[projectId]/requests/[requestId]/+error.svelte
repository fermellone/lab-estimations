<script>
	import { page } from '$app/stores';
	export let $$props;
</script>

{#await page}
	<div>loading...</div>
{:then page}
			<h1>Error {$$props.error.statusCode}</h1>
	{/if}
{/await}
