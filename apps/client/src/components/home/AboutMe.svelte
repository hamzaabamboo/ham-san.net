<script lang="ts">
	import Box from '@components/core/Box.svelte';
	import Container from '@components/core/Container.svelte';
	import Stack from '@components/core/Stack.svelte';
	import Typography from '@components/core/Typography.svelte';
	import MarkdownRenderer from '@components/markdown/MarkdownRenderer.svelte';
	import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import { t } from '@i18n';
	import Fa from 'svelte-fa';

	export let content: string | null | undefined;
	export let image: string | undefined;
</script>

<Container fluid class="bg-white px-2 py-8 relative z-20">
	<Container>
		<Stack styles={{ lg: { flexDir: 'column' } }}>
			<Box styles={{ w: { base: 'full', lg: '1/2' } }}>
				<Typography variant="h2" class="mb-4">{$t('home.about-me')}</Typography>
				{#if content}<MarkdownRenderer {content} />{/if}
				<Typography class="font-sm mt-2 font-gray-300"
					><a href="/about"
						>{$t('home.find-out-more')}
						<Fa icon={faArrowRight} class="inline ml-2 transition relative hover:right-2" />
					</a></Typography
				>
			</Box>
			<Box styles={{ w: { base: 'full', lg: '1/2' } }}>
				<img
					class="mx-auto"
					src={image ??
						'https://1.bp.blogspot.com/-uvEg1u2GbOA/Xbo6RFkasGI/AAAAAAABVv0/VmZEUI9EqGojzfBajCmBifQjlWGJO_GeACNcBGAsYHQ/s400/yaruki_aru_suit_man.png'}
					alt="Enthusiastic Developer"
				/>
			</Box>
		</Stack>
	</Container>
</Container>
