<script lang="ts">
	import { page } from '$app/stores';
</script>

{#if $page.status === 500}
	<pre>{$page.error?.message}</pre>
	<pre>{$page.error}</pre>
{/if}
