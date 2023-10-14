<script lang="ts">
	import Typography from '@components/core/Typography.svelte';

	export let text: string;
	export let raw: string;
</script>

<Typography variant="body"><slot /></Typography>
