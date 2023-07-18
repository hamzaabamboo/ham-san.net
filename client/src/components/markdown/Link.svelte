<script lang="ts">
	import { getContext } from "svelte";
	import { markdownContextKey } from "./MarkdownContext";

	export let href = '';
	export let title: string | undefined = undefined;
	
	const { getRelativeUrlRoot } = getContext(markdownContextKey);
	const urlRoot = getRelativeUrlRoot();
</script>

<a href={href.includes("http") ? href: urlRoot ? urlRoot + href : href } {title} target={href.includes("http") ? "_blank" : undefined} rel={href.includes("http") ?"noreferrer" : undefined } class="text-blue-400"><slot /></a>
