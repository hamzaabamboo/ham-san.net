<script>
	import '../app.css';
	import Header from '@components/Header.svelte';
	import Footer from '@components/Footer.svelte';
	import { t } from '@i18n';
	import { onMount } from 'svelte';
	import GoogleTagManager from '@components/core/GoogleTagManager.svelte';
	import { preparePageTransition } from '@utils/preparePageTransition';

	let isReady = false;

	onMount(() => {
		document.fonts.load('16px Noto Sans JP').then(() => (isReady = true));
	});

	preparePageTransition();
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

<GoogleTagManager gtmId="G-2FPKQLHT9H" timeout={1000} />

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

	/* https://geoffrich.net/posts/page-transitions-1/ */
	html::view-transition-old() {
		animation-name: -ua-view-transition-fade-out;
		animation-duration: inherit;
		animation-fill-mode: inherit;
	}

	html::view-transition-new() {
		animation-name: -ua-view-transition-fade-in;
		animation-duration: inherit;
		animation-fill-mode: inherit;
	}

	::view-transition-old(root),
	::view-transition-new(root) {
		animation-duration: 5s;
	}
</style>
