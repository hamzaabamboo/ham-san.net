<script lang="ts">
	// https://gist.github.com/jssteinberg/a3f901440c9d1b567b22e4ebeae03d70
	import { onMount } from 'svelte';

	export let gtmId = '';
	export let gtmDataPoints: (object | object[])[] = [];

	export let timeout = 0;

	export let dev = false;

	let scriptSrc: string | undefined;

	const getScriptSrcFromInitGtm = (
		customDataPoints: (object | object[])[] = [],
		globalObject = window
	) => {
		const requiredDataPoint = {
			'gtm.start': new Date().getTime(),
			event: 'gtm.js'
		};

		const getScriptSrcForGtm = (gtmId: string) => {
			if (!dev && (typeof gtmId !== 'string' || !gtmId.length)) {
				return;
			} else if (typeof gtmId !== 'string' || !gtmId.length) {
				console.error('Google Tag Manager.', 'Missing/wrong `gtmId`.');
			} else {
				return `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
			}
		};
		try {
			const dataLayer = [requiredDataPoint].concat(customDataPoints);
			globalObject['dataLayer'] = globalObject['dataLayer']
				? [...globalObject['dataLayer'], ...dataLayer]
				: dataLayer;
		} catch (error) {
			if (!dev) console.error('Google Tag Manager.', error);
		} finally {
			return getScriptSrcForGtm; // …no matter what, for no error.
		}
	};
	onMount(() => {
		if (!timeout) scriptSrc = getScriptSrcFromInitGtm(gtmDataPoints)(gtmId);
		else
			setTimeout(() => {
				scriptSrc = getScriptSrcFromInitGtm(gtmDataPoints)(gtmId);
			}, timeout);
	});
</script>

<svelte:head>
	{#if scriptSrc}
		<script src={scriptSrc} defer></script>
	{/if}
</svelte:head>
