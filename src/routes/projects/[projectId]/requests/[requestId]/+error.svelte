<script lang="ts">
	import { page } from '$app/stores';
</script>

<p>Hola: {JSON.stringify($page)}</p>
<h1>Something went wrong: {$page.status}</h1>
<p>Cosito: {$page.error?.message}</p>
