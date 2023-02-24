<script>
	import AboutMe from '@components/home/AboutMe.svelte';
	import BeforeFooter from '@components/home/BeforeFooter.svelte';
	import FeaturedProjects from '@components/home/FeaturedProjects.svelte';
	import Hero from '@components/home/Hero.svelte';
	import { t } from '@i18n';
</script>

<svelte:head>
	<title>{$t('common.name')}</title>
</svelte:head>

<Hero />
<AboutMe />
<FeaturedProjects />
<BeforeFooter />
