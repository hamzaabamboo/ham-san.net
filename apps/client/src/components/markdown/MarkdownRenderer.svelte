<script lang="ts">
	import { setContext } from 'svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import Divider from '../core/Divider.svelte';
	import Heading from './Heading.svelte';
	import Image from './Image.svelte';
	import Link from './Link.svelte';
	import List from './List.svelte';
	import ListItem from './ListItem.svelte';
	import { markdownContextKey } from './MarkdownContext';
	import Paragraph from './Paragraph.svelte';
	import Text from './Text.svelte';

	export let content: string | null | undefined;
	export let mediaRoot: string | undefined = undefined;
	export let relativeUrlRoot: string | undefined = undefined;

	$: setContext(markdownContextKey, {
		getMediaRoot: () => mediaRoot,
		getRelativeUrlRoot: () => relativeUrlRoot
	});
</script>

<!-- https://github.com/pablo-abc/svelte-markdown/tree/main/src/renderers -->
<div class="text-justify">
	<SvelteMarkdown
		source={content}
		renderers={{
			text: Text,
			heading: Heading,
			image: Image,
			paragraph: Paragraph,
			list: List,
			listitem: ListItem,
			link: Link,
			hr: Divider
		}}
	/>
</div>
