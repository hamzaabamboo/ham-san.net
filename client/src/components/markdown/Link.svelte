<script lang="ts">
	import { getContext } from "svelte";
	import { markdownContextKey } from "./MarkdownContext";

	export let href = '';
	export let title: string | undefined = undefined;
	
	const { getRelativeUrlRoot } = getContext(markdownContextKey);
	const urlRoot = getRelativeUrlRoot();
</script>

<a href={href.includes("http") ? href: urlRoot ? urlRoot + href : href } {title} target="_blank" rel="noreferrer" class="text-blue-400"><slot /></a>
