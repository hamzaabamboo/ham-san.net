<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import Heading from '@components/markdown/Heading.svelte';
	import Text from '@components/markdown/Text.svelte';
	import Image from '@components/markdown/Image.svelte';
	import Paragraph from '@components/markdown/Paragraph.svelte';
	import List from '@components/markdown/List.svelte';
	import ListItem from '@components/markdown/ListItem.svelte';

	export let content: string | null | undefined;
</script>

<SvelteMarkdown
	source={content}
	renderers={{
		text: Text,
		heading: Heading,
		image: Image,
		paragraph: Paragraph,
		list: List,
		listitem: ListItem
	}}
/>
