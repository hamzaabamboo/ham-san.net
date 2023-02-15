<script>
	import Button from '@components/core/Button.svelte';
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';
	import { t } from '@i18n';
</script>

<Container fluid class="bg-primary bg-opacity-10 ">
	<Container>
		<div
			class="hero sm:min-h-screen lg:min-h-16 flex sm:items-end lg:items-center sm:justify-center lg:justify-start lg:pl-4 w-full"
		>
			<div class="px-4 py-4 bg-white bg-opacity-70 bg-secondary">
				<Typography variant="title">{$t('home.hero-text')}</Typography>
				<Typography variant="subtitle" class="mb-4">{$t('home.hero-subtitle')}</Typography>
				<!-- <Button>{$t('home.hero-cta')}</Button> -->
			</div>
		</div>
	</Container>
</Container>

<style lang="scss">
	.hero {
		min-height: 500px;
	}
</style>
