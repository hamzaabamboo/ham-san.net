<script lang="ts">
	import MetaTags from '@components/core/MetaTags.svelte';
	import AboutMe from '@components/home/AboutMe.svelte';
	import BeforeFooter from '@components/home/BeforeFooter.svelte';
	import FeaturedProjects from '@components/home/FeaturedProjects.svelte';
	import Hero from '@components/home/Hero.svelte';
	import { t } from '@i18n';
	import { getMediaUrl } from '@utils/media';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let bannerWidth: number;

	$: projects = data?.data?.projects?.data.map((p) => p.attributes).filter((p) => !!p);
	$: homepageData = data?.data?.homepage?.data?.attributes;
</script>

<MetaTags
	title={$t('common.name')}
	path=""
	image={getMediaUrl(homepageData?.heroImage?.data?.attributes?.url, { width: 1200 })}
/>

<Hero
	bind:maxBannerWidth={bannerWidth}
	hero={homepageData?.hero}
	subtitle={homepageData?.heroSubtitle}
	bg={getMediaUrl(homepageData?.heroImage?.data?.attributes?.url, {
		height: 500,
		width: bannerWidth,
		fit: 'outside'
	})}
/>
<AboutMe
	content={homepageData?.introduction}
	image={getMediaUrl(homepageData?.introductionImage?.data?.attributes?.url, { height: 400 })}
/>
<FeaturedProjects {projects} />
<BeforeFooter />
