<script lang="ts">
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';
	import ProjectCard from '@components/projects/ProjectCard.svelte';
	import { t, locale } from '@i18n';
	import { getMediaUrl } from '@utils/media';
	import { fetchProjects } from '../../graphql/generated/client';

	$: projects = fetchProjects({ variables: { locale: $locale } });
</script>

<Container class="my-8">
	<Typography variant="h2" class="mb-4">{$t('project.projects')}</Typography>
	{#if projects}
		{#if $projects.loading}
			Loading...
		{:else if $projects.error}
			Error: {$projects.error.message}
		{:else if $projects.data.projects?.data && $projects.data.projects.data.length > 0}
			<div class="flex flex-row flex-wrap">
				{#each $projects.data?.projects.data as project}
					<ProjectCard
						project={project.attributes}
						class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2 block"
					/>
				{/each}
			</div>
		{:else}
			Projects not found
		{/if}
	{/if}
</Container>
