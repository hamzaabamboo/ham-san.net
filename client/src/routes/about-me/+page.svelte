<script lang="ts">
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';
	import { fetchAboutMe } from '@graphql/generated/client';
	import { locale, t } from '@i18n';

	$: query = fetchAboutMe({ variables: { locale: $locale } });

	$: experiences = $query.data.experiences?.data;
	$: educations = $query.data.educations?.data;
</script>

<Container class="pt-8 flex flex-col">
	<Typography variant="h1">{$t('about-me.title')}</Typography>
	<Typography variant="h2">{$t('about-me.experiences')}</Typography>
	{#if experiences && experiences?.length > 0}
		{#each experiences as experience}
			<div>
				<Typography variant="h4">{experience.attributes?.title}</Typography>
			</div>
		{/each}
	{/if}
	<Typography variant="h2">{$t('about-me.education')}</Typography>
	{#if educations && educations?.length > 0}
		{#each educations as education}
			<div>
				<Typography variant="h4">{education.attributes?.title}</Typography>
			</div>
		{/each}
	{/if}
</Container>
