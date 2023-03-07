<script lang="ts">
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';
	import ProjectCard from '@components/projects/ProjectCard.svelte';
	import { t } from '@i18n';
	import type { ProjectPreviewFragment } from '@graphql/generated/server';

	export let projects: ProjectPreviewFragment[] = [];
</script>

<Container class="my-8">
	<Typography variant="h2" class="mb-4">{$t('home.featured-projects')}</Typography>
	{#if projects && projects.length > 0}
		<div class="flex flex-col sm:flex-row flex-wrap">
			{#each projects as project}
				{#if project}
					<ProjectCard class="sm:w-1/2 lg:w-1/3 px-2" {project} />
				{/if}
			{/each}
		</div>
	{/if}
</Container>
