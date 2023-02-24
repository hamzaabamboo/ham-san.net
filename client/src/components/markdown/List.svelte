<script lang="ts">
	export let ordered: boolean;
	export let start: number;
</script>

{#if ordered}
	<ol class="list-decimal ml-4 mb-2" {start}><slot /></ol>
{:else}
	<ul class="list-disc ml-4 mb-2"><slot /></ul>
{/if}
