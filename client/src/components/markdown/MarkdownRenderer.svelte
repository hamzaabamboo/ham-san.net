<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import Heading from './Heading.svelte';
	import Text from './Text.svelte';
	import Image from './Image.svelte';
	import Paragraph from './Paragraph.svelte';
	import List from './List.svelte';
	import ListItem from './ListItem.svelte';
	import Link from './Link.svelte';

	export let content: string | null | undefined;
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
			link: Link
		}}
	/>
</div>
