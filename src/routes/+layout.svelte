<script>
	import '../app.css';
	let { children } = $props();
</script>

<nav class="h-12"></nav>
<div class="mx-4 my-2">
	{@render children()}
</div>
<footer></footer>
