<script>
	import '../app.css';
	import Header from '@components/Header.svelte';
	import Footer from '@components/Footer.svelte';
	import { t } from '@i18n';
	import { onMount } from 'svelte';

	let isReady = false;

	onMount(() => {
		document.fonts.load('16px Noto Sans JP').then(() => (isReady = true));
	});
</script>

<svelte:head>
	<title>{$t('common.name')}</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin="true" />
	<link
		rel="preload"
		as="style"
		href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;400;700&display=swap"
	/>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;400;700&display=swap"
	/>
	<!-- <link
		href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;400;700;900&family=Noto+Sans+Thai:wght@100;400;700;900&display=swap"
		rel="stylesheet"
	/> -->
</svelte:head>

<div class="h-screen flex flex-col" class:unstyled={!isReady}>
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

<style>
	/* https://meowni.ca/font-style-matcher/ */
	.unstyled {
		line-height: 1.6;
		font-family: sans-serif;
		letter-spacing: 0.35px;
		word-spacing: 0.15px;
		/* font-weight: 400; */
	}
</style>
