<script lang="ts">
	export let href = '';
	export let title: string | undefined = undefined;
</script>

<a {href} {title} target="_blank" rel="noreferrer" class="text-blue-400"><slot /></a>
