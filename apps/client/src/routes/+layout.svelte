<script>
  import { disableScrollHandling } from '$app/navigation';
  import { page } from '$app/stores';
  import Footer from '@components/Footer.svelte';
  import Header from '@components/Header.svelte';
  import GoogleTagManager from '@components/core/GoogleTagManager.svelte';
  import { t } from '@i18n';
  import { preparePageTransition } from '@utils/preparePageTransition';
  import { onMount } from 'svelte';
  import '../app.css';

  let isReady = false;

  const HIDE_NAVBAR = ['/namecard'];
  const HIDE_FOOTER = ['/namecard'];

  onMount(() => {
    document.fonts.load('16px Noto Sans JP').then(() => (isReady = true));
    disableScrollHandling();
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
  {#if !HIDE_NAVBAR.includes($page.url.pathname)}
    <Header />
  {/if}
  <div
    class="flex-1 h-full flex flex-col overflow-x-hidden overflow-y-auto"
    style:perspective="8px"
    style:perspective-origin="center"
  >
    <div class="flex-1 flex flex-col" style:transform-style="preserve-3d">
      <slot />
    </div>
    {#if !HIDE_FOOTER.includes($page.url.pathname)}
      <Footer />
    {/if}
  </div>
</div>

<style>
  /* https://meowni.ca/font-style-matcher/ */
  .unstyled {
    line-height: 1.5;
    font-family: sans-serif;
    word-spacing: -0.25px;
    letter-spacing: 0.5px;
    font-weight: 400;
    /* font-weight: 400; */
  }

  /* https://geoffrich.net/posts/page-transitions-1/ */
  /* https://developer.chrome.com/docs/web-platform/view-transitions/#transitioning-elements-dont-need-to-be-the-same-dom-element */
  /* html::view-transition-old() {
		animation-name: -ua-view-transition-fade-out;
		animation-duration: inherit;
		animation-fill-mode: inherit;
	}

	html::view-transition-new() {
		animation-name: -ua-view-transition-fade-in;
		animation-duration: inherit;
		animation-fill-mode: inherit;
	} */

  /* ::view-transition-old(root),
	::view-transition-new(root) {
	  animation-duration: 5s; 
	} */
</style>
