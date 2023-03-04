<script lang="ts">
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';
	import MarkdownRenderer from '@components/markdown/MarkdownRenderer.svelte';
	import ProjectCard from '@components/projects/ProjectCard.svelte';
	import { t, locale } from '@i18n';
	import { formatMonthYear } from '@utils/date';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: tag = data.data?.tags?.data?.[0]?.attributes;
	$: experiences = tag?.experiences?.data;
	$: projects = tag?.projects?.data;

	$: formatDate = (date?: string) => (date ? formatMonthYear(date, $locale) : null);
</script>

<svelte:head>
	<title>{tag?.title} | {$t('common.name')}</title>
</svelte:head>

<Container class="pt-12">
	<Typography variant="title">{tag?.title}</Typography>
	<Typography variant="h4">{$t('common.experiences')}</Typography>
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
								formatDate(experience.attributes?.end) ?? $t('common.present')
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
	<Typography variant="h4">{$t('common.projects')}</Typography>
	<div class="flex flex-row flex-wrap mb-2">
		{#if projects?.length && projects.length > 0}
			{#each projects as project}
				<ProjectCard
					project={project.attributes}
					class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2 block"
				/>
			{/each}
		{:else}
			Projects not found
		{/if}
	</div>
</Container>
