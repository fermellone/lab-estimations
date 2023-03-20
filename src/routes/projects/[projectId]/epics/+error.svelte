<script>
	import { page } from '$app/stores';
</script>

<h1>Something went wrong: {$page.status}</h1>
<p>{$page.error?.message}</p>
