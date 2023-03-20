<script>
	import { page } from '$app/stores';
</script>

{#if $page.status === 404}
	<h1>No ta</h1>
	<p>{$page.error?.message}</p>
{/if}
