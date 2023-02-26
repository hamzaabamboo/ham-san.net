<script lang="ts">
	import Container from '@components/core/Container.svelte';
	import Pill from '@components/core/Pill.svelte';
	import Typography from '@components/core/Typography.svelte';
	import MarkdownRenderer from '@components/markdown/MarkdownRenderer.svelte';
	import { fetchAboutMe, Enum_Tag_Type } from '@graphql/generated/client';

	import { locale, t } from '@i18n';
	import { toKebabCase } from '@utils/localization';
	import groupBy from 'lodash/groupBy';

	import aboutMeBanner from '@assets/about-me-banner.jpg';
	import { formatMonthYear } from '@utils/date';
	import TagItem from '@components/tags/TagItem.svelte';

	$: query = fetchAboutMe({ variables: { locale: $locale } });

	$: experiences = $query.data.experiences?.data;
	$: educations = $query.data.educations?.data;
	$: aboutMetadata = $query.data.aboutMe?.data?.attributes;
	$: skills = groupBy(
		$query.data.tags?.data?.filter((tag) => tag.attributes?.type !== Enum_Tag_Type.NonDev),
		(tag) => tag.attributes?.type
	);

	$: formatDate = (date?: string) => (date ? formatMonthYear(date, $locale) : null);
</script>

<svelte:head>
	<title>{$t('common.name')} | {$t('common.about-me')}</title>
</svelte:head>

{#if $query.loading}
	<Container class="text-center pt-8">Loading</Container>
{:else}
	<Container class="pt-12 flex flex-row  flex-wrap">
		<div class="px-4 flex flex-col w-full md:w-3/5">
			<div class="mb-2">
				<Typography variant="h1">{$t('about-me.title')}</Typography>
			</div>
			{#if !!aboutMetadata}<MarkdownRenderer content={aboutMetadata.introduction} />{/if}
			<Typography variant="h2">{$t('about-me.experiences')}</Typography>
			{#if experiences && experiences?.length > 0}
				{#each experiences as experience}
					<div class="flex flex-col mb-2">
						<Typography variant="h4" class="mb-1">{experience.attributes?.title}</Typography>
						<div class="flex flex-row mb-2">
							<Typography variant="subtitle" class="mr-2"
								>{[
									experience.attributes?.position,
									experience.attributes?.description,
									`${formatDate(experience.attributes?.start)} - ${
										formatDate(experience.attributes?.end) ?? $t('about-me.present')
									}`
								]
									.filter((i) => !!i)
									.join(' | ')}</Typography
							>
						</div>
						{#if experience.attributes?.content}
							<MarkdownRenderer content={experience.attributes?.content} />
						{/if}
					</div>
				{/each}
			{/if}
			<hr class="mb-2" />
			<Typography variant="h2">{$t('about-me.education')}</Typography>
			{#if educations && educations?.length > 0}
				{#each educations as education}
					<div class="mb-2 flex flex-col">
						<Typography variant="h4" class="mb-1">{education.attributes?.title}</Typography>
						<div class="flex flex-row mb-2">
							<Typography variant="subtitle" class="mr-2"
								>{[
									education.attributes?.description,
									`${formatDate(education.attributes?.start)} - ${
										formatDate(education.attributes?.end) ?? $t('about-me.present')
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
							{#if tag.attributes} <TagItem tag={tag?.attributes} class="mr-2" /> {/if}
						{/each}
					</div>
				{/each}
			</div>
			<hr />
		</div>
		<div
			class="bg-cover bg-left w-full md:w-2/5"
			style:height="400px"
			style:background-image="url('{aboutMeBanner.fallback.src}')"
		/>
	</Container>
{/if}
