<script>
	import '../app.css';
	import Header from '@components/Header.svelte';
	import Footer from '@components/Footer.svelte';
	import { t } from '@i18n';
	import MetaTags from '@components/core/MetaTags.svelte';
</script>

<svelte:head>
	<title>{$t('common.name')}</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;400;700;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="h-screen flex flex-col">
	<Header />
	<div
		class="flex-1 h-full flex flex-col overflow-x-hidden overflow-y-auto"
		style:perspective="8px"
		style:perspective-origin="center"
	>
		<div class="flex-1 flex flex-col" style:transform-style="preserve-3d">
			<slot />
		</div>
		<Footer />
	</div>
</div>
