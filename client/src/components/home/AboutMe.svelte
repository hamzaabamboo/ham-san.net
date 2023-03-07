<script lang="ts">
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';
	import Fa from 'svelte-fa';
	import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import { t } from '@i18n';
	import MarkdownRenderer from '@components/markdown/MarkdownRenderer.svelte';

	export let content: string;
</script>

<Container fluid class="bg-white px-2 py-8 relative z-20">
	<Container>
		<div class="flex flex-col lg:flex-row">
			<div class="w-full lg:w-1/2">
				<Typography variant="h2" class="mb-4">{$t('home.about-me')}</Typography>
				{#if content}<MarkdownRenderer {content} />{/if}
				<Typography class="font-sm mt-2 font-gray-300"
					><a href="/about-me"
						>{$t('home.find-out-more')}
						<Fa icon={faArrowRight} class="inline ml-2 transition relative hover:right-2" />
					</a></Typography
				>
			</div>
			<div class="w-full lg:w-1/2">
				<img
					class="mx-auto"
					src="https://1.bp.blogspot.com/-uvEg1u2GbOA/Xbo6RFkasGI/AAAAAAABVv0/VmZEUI9EqGojzfBajCmBifQjlWGJO_GeACNcBGAsYHQ/s400/yaruki_aru_suit_man.png"
					alt="Enthusiastic Developer"
				/>
			</div>
		</div>
	</Container>
</Container>
