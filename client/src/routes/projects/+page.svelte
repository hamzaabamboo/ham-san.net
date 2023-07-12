<script lang="ts">
	import Container from '@components/core/Container.svelte';
	import MetaTags from '@components/core/MetaTags.svelte';
	import Typography from '@components/core/Typography.svelte';
	import ProjectCard from '@components/projects/ProjectCard.svelte';
	import { locale, t } from '@i18n';
	import { fallbackLocale } from '@utils/fallbackLocale';
	import groupBy from 'lodash/groupBy';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: projects = data.data;
	$: projectGroups = groupBy(projects.projects?.data, (project) =>
		project.attributes?.isActive ? $t('project.active') : $t('project.inactive')
	);
</script>

<MetaTags title="{$t('project.projects')} | {$t('common.name')}" path="projects" />

<Container class="my-8">
	<Typography variant="h2" class="mb-4">{$t('project.projects')}</Typography>
	<div class="flex flex-col">
		{#if projects}
			{#if projects.projects?.data && projects.projects.data.length > 0}
				{#each Object.keys(projectGroups) as group}
					<Typography variant="h4" class="mb-2">{group}</Typography>
					<div class="flex flex-row flex-wrap mb-2">
						{#each projectGroups[group] as project}
							{#if project.attributes}
								<ProjectCard
									project={fallbackLocale(project, $locale)}
									class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2"
								/>
							{/if}
						{/each}
					</div>
					<hr class="mb-2" />
				{/each}
			{:else}
				Projects not found
			{/if}
		{/if}
	</div>
</Container>
