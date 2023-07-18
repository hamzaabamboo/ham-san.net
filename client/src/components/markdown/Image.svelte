<script>
	import { getMediaUrl } from '@utils/media';
	import { getContext } from 'svelte';
	import { markdownContextKey } from './MarkdownContext';

	export let href = '';
	export let title = undefined;
	export let text = '';
	
	const { getMediaRoot } = getContext(markdownContextKey)
	const mediaRoot = getMediaRoot()
</script>

<div class="w-full flex flex-col items-center object-fit-contain justify-center my-4">
	<img class="max-h-[96]" src={href.includes("http") ? href : mediaRoot !== undefined ? mediaRoot + href : getMediaUrl(href, { height: 300 })} {title} alt={text} />
	{#if text}
		<span class="text-sm">{text}</span>
	{/if}
</div>
