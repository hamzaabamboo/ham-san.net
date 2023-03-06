<script lang="ts">
	import Container from '@components/core/Container.svelte';
	import Pill from '@components/core/Pill.svelte';
	import Typography from '@components/core/Typography.svelte';
	import MarkdownRenderer from '@components/markdown/MarkdownRenderer.svelte';
	import { Enum_Tag_Type } from '@graphql/generated/client';

	import { locale, t } from '@i18n';
	import { toKebabCase } from '@utils/localization';
	import groupBy from 'lodash/groupBy';

	import aboutMeBanner from '@assets/about-me-banner.jpg?format=webp&w=1980';
	import { formatMonthYear, parseDate } from '@utils/date';
	import TagItem from '@components/tags/TagItem.svelte';
	import ExperienceItem from '@components/experience/ExperienceItem.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: query = data.data;

	$: experiences = query.experiences?.data;
	$: educations = query.educations?.data;
	$: aboutMetadata = query.aboutMe?.data?.attributes;
	$: skills = groupBy(
		query.tags?.data?.filter((tag) => tag.attributes?.type !== Enum_Tag_Type.NonDev),
		(tag) => tag.attributes?.type
	);

	$: formatDate = (date?: string) => (date ? formatMonthYear(parseDate(date), $locale) : null);
</script>

<svelte:head>
	<title>{$t('common.about-me')} | {$t('common.name')}</title>
</svelte:head>

<Container class="pt-12 flex flex-row  flex-wrap">
	<div class="px-4 flex flex-col w-full md:w-3/5">
		<div class="mb-2">
			<Typography variant="h1">{$t('about-me.title')}</Typography>
		</div>
		{#if !!aboutMetadata}<MarkdownRenderer content={aboutMetadata.introduction} />{/if}
		<Typography variant="h2">{$t('common.experiences')}</Typography>
		{#if experiences && experiences?.length > 0}
			{#each experiences as experience}
				<ExperienceItem experience={experience.attributes} />
			{/each}
		{/if}
		<hr class="mb-2" />
		<Typography variant="h2">{$t('common.education')}</Typography>
		{#if educations && educations?.length > 0}
			{#each educations as education}
				<div class="mb-2 flex flex-col">
					<Typography variant="h4" class="mb-1">{education.attributes?.title}</Typography>
					<div class="flex flex-row mb-2">
						<Typography variant="subtitle" class="mr-2"
							>{[
								education.attributes?.description,
								`${formatDate(education.attributes?.start)} - ${
									formatDate(education.attributes?.end) ?? $t('common.present')
								}`
							]
								.filter((i) => !!i)
								.join(' | ')}</Typography
						>
					</div>
					{#if education.attributes?.content}
						<MarkdownRenderer content={education.attributes?.content} />
					{/if}
				</div>
			{/each}
		{/if}
		<hr class="mb-2" />
		<Typography variant="h2">{$t('about-me.skills')}</Typography>
		<div class="flex flex-col">
			{#each Object.keys(skills) as category}
				<div class="flex flex-row flex-wrap mb-2">
					<Typography variant="h6" class="mr-2"
						>{$t(`common.${toKebabCase(category)}`)} :</Typography
					>
					{#each skills[category] as tag}
						{#if tag.attributes}
							<a href="/tags/{tag?.attributes.slug}" class="block"
								><TagItem tag={tag?.attributes} class="mr-2 mb-2" showProjectCount /></a
							>
						{/if}
					{/each}
				</div>
			{/each}
		</div>
		<hr />
	</div>
	<div
		class="bg-cover bg-left w-full md:w-2/5"
		style:height="400px"
		style:background-image="url('{aboutMeBanner}')"
	/>
</Container>
