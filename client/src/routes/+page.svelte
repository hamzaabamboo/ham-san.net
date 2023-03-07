<script lang="ts">
	import AboutMe from '@components/home/AboutMe.svelte';
	import BeforeFooter from '@components/home/BeforeFooter.svelte';
	import FeaturedProjects from '@components/home/FeaturedProjects.svelte';
	import Hero from '@components/home/Hero.svelte';
	import { t } from '@i18n';
	import { getMediaUrl } from '@utils/media';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: projects = data?.data?.projects?.data.map((p) => p.attributes).filter((p) => !!p);
	$: homepageData = data?.data?.homepage?.data?.attributes;
</script>

<svelte:head>
	<title>{$t('common.name')}</title>
</svelte:head>

<Hero
	hero={homepageData?.hero}
	subtitle={homepageData?.heroSubtitle}
	bg={getMediaUrl(homepageData?.heroImage?.data?.attributes?.url, { width: 1920 })}
/>
<AboutMe content={homepageData?.introduction} />
<FeaturedProjects {projects} />
<BeforeFooter />
