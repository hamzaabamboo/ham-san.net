<script>
	import AboutMe from '@components/home/AboutMe.svelte';
	import BeforeFooter from '@components/home/BeforeFooter.svelte';
	import FeaturedProjects from '@components/home/FeaturedProjects.svelte';
	import Hero from '@components/home/Hero.svelte';
</script>

<div style:perspective="8px"
style:perspective-origin="center">
<Hero />
<AboutMe />
<FeaturedProjects />
<BeforeFooter />
</div>
