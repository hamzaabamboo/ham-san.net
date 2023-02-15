<script>
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';
	import { t } from '@i18n';

	$: paragraphs = $t('home.about-me-content').split('\n');
</script>

<Container class="px-2 py-8">
	<div class="flex flex-col lg:flex-row">
		<div class="w-full lg:w-1/2">
			<Typography variant="h2" class="mb-4">{$t('home.about-me')}</Typography>
			{#each paragraphs as paragraph}
				<Typography class="mb-2">{paragraph}</Typography>
			{/each}
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
