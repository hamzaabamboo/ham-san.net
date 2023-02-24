<script>
	import Button from '@components/core/Button.svelte';
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';
	import heroBg from '@assets/hero-bg.jpg';
	import { t } from '@i18n';
</script>

<Container fluid class="bg-primary bg-opacity-10 relative">
	<!-- https://medium.com/@dailyfire/pure-css-parallax-simple-tricks-da102d0ffdb9 -->
	<div
		class="bg-cover bg-center h-full w-full absolute z-0"
		style:transform="translateZ(-1px) scale(1.3)"
		style:background-image="url('{heroBg}')"
		style:filter="blur(2px)"
	/>
	<div style:transform="translateZ(1px) scale(0.875)">
		<Container class="relative z-10">
			<div
				class="hero sm:min-h-screen lg:min-h-16 flex items-center sm:justify-center lg:justify-start lg:pl-4 w-full"
			>
				<div class="px-4 py-4 bg-opacity-90 bg-secondary">
					<Typography variant="title">{$t('home.hero-text')}</Typography>
					<Typography variant="subtitle" class="mb-4">{$t('home.hero-subtitle')}</Typography>
					<!-- <Button>{$t('home.hero-cta')}</Button> -->
				</div>
			</div>
		</Container>
	</div>
</Container>

<style lang="scss">
	.hero {
		min-height: 500px;
	}
</style>
