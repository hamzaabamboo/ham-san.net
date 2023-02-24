<script lang="ts">
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';
	import ProjectCard from '@components/projects/ProjectCard.svelte';
	import { t } from '@i18n';
	import { fetchProjects } from '@graphql/generated/client';

	let projects = fetchProjects({ variables: { limit: 3, isFeatured: true } });
</script>

<Container class="my-8">
	<Typography variant="h2" class="mb-4">{$t('home.featured-projects')}</Typography>
	{#if projects}
		{#if $projects.loading}
			Loading...
		{:else if $projects.error}
			Error: {$projects.error.message}
		{:else if $projects.data.projects?.data && $projects.data.projects.data.length > 0}
			<div class="flex flex-col sm:flex-row flex-wrap">
				{#each $projects.data?.projects.data as project}
					{#if !!project.attributes}
						<ProjectCard project={project.attributes} />
					{/if}
				{/each}
			</div>
		{:else}
			Projects not found
		{/if}
	{/if}
</Container>

<style lang="scss">
</style>
