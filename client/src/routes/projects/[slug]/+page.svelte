<script lang="ts">
	import type { GetProjectBySlugQuery } from '../../../graphql/generated/client';
	import SvelteMarkdown from 'svelte-markdown';
	import Heading from '@components/markdown/Heading.svelte';
	import Text from '@components/markdown/Text.svelte';
	import Image from '@components/markdown/Image.svelte';
	import Container from '@components/core/Container.svelte';

	/** @type {import('./$types').PageData} */
	export let data: GetProjectBySlugQuery;

	const content = data.projects?.data[0].attributes?.content;
</script>

<Container>
	<SvelteMarkdown
		source={content}
		renderers={{
			text: Text,
			heading: Heading,
			image: Image
		}}
	/>
</Container>
