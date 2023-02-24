<script lang="ts">
	import Container from '@components/core/Container.svelte';
	import Pill from '@components/core/Pill.svelte';
	import Typography from '@components/core/Typography.svelte';
	import MarkdownRenderer from '@components/markdown/MarkdownRenderer.svelte';
	import { fetchAboutMe, Enum_Tag_Type } from '@graphql/generated/client';

	import { locale, t } from '@i18n';
	import groupBy from 'lodash/groupBy';

	$: query = fetchAboutMe({ variables: { locale: $locale } });

	$: experiences = $query.data.experiences?.data;
	$: educations = $query.data.educations?.data;
	$: aboutMetadata = $query.data.aboutMe?.data?.attributes;
	$: skills = groupBy(
		$query.data.tags?.data?.filter((tag) => tag.attributes?.type !== Enum_Tag_Type.NonDev),
		(tag) => tag.attributes?.type
	);
</script>

<svelte:head>
	<title>{$t('common.name')} | {$t('common.about-me')}</title>
</svelte:head>

<Container class="pt-8 flex flex-col">
	<Typography variant="h1">{$t('about-me.title')}</Typography>
	{#if !!aboutMetadata}<MarkdownRenderer content={aboutMetadata.introduction} />{/if}
	<Typography variant="h2">{$t('about-me.experiences')}</Typography>
	{#if experiences && experiences?.length > 0}
		{#each experiences as experience}
			<div class="flex flex-col mb-2">
				<Typography variant="h4" class="mb-1">{experience.attributes?.title}</Typography>
				<div class="flex flex-row mb-2">
					<Typography variant="subtitle" class="mr-2"
						>{experience.attributes?.description}</Typography
					>
					{#if experience.attributes?.start}
						<Typography variant="subtitle">
							| {experience.attributes?.start} - {experience.attributes?.end ??
								$t('about-me.present')}
						</Typography>
					{/if}
				</div>
				{#if experience.attributes?.content}
					<MarkdownRenderer content={experience.attributes?.content} />
				{/if}
			</div>
		{/each}
	{/if}
	<Typography variant="h2">{$t('about-me.education')}</Typography>
	{#if educations && educations?.length > 0}
		{#each educations as education}
			<div class="mb-2 flex flex-col">
				<Typography variant="h4" class="mb-1">{education.attributes?.title}</Typography>
				<div class="flex flex-row mb-2">
					<Typography variant="subtitle" class="mr-2"
						>{education.attributes?.description}</Typography
					>
					{#if education.attributes?.start}
						<Typography variant="subtitle">
							| {education.attributes?.start} - {education.attributes?.end ??
								$t('about-me.present')}
						</Typography>
					{/if}
				</div>
				{#if education.attributes?.content}
					<MarkdownRenderer content={education.attributes?.content} />
				{/if}
			</div>
		{/each}
	{/if}
	<Typography variant="h2">{$t('about-me.skills')}</Typography>
	<div class="flex flex-col">
		{#each Object.keys(skills) as category}
			<div class="flex flex-row flex-wrap mb-2">
				<Typography variant="h6" class="mr-2">{category} :</Typography>
				{#each skills[category] as tag}
					<Pill class="mr-2">{tag.attributes?.title}</Pill>
				{/each}
			</div>
		{/each}
	</div>
</Container>
