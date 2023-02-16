<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import Heading from '@components/markdown/Heading.svelte';
	import Text from '@components/markdown/Text.svelte';
	import Image from '@components/markdown/Image.svelte';

	export let content: string | null | undefined;
</script>

<SvelteMarkdown
	source={content}
	renderers={{
		text: Text,
		heading: Heading,
		image: Image
	}}
/>
