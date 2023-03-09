<script lang="ts">
	import { t } from '@i18n';
	import { PUBLIC_URL } from '$env/static/public';

	export let title: string;
	export let description: string | undefined = undefined;
	export let image: string | undefined = undefined;
	export let path: string;
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />
	<meta property="og:site_name" content={$t('common.name')} />
	{#if path !== 'undefined'}
		<link rel="canonical" href="{PUBLIC_URL}/{path}" />
		<meta property="og:url" content="{PUBLIC_URL}/{path}" />
	{/if}
	{#if description}
		<meta property="og:description" content={description} />
		<meta name="description" content={description} />
		<meta name="twitter:description" content={description} />
	{/if}
	{#if image}
		<meta property="og:image" content={image} />
		<meta name="twitter:image:src" content={image} />
	{/if}
</svelte:head>
