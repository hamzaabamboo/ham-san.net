<script lang="ts">
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';
	import { t } from '@i18n';
	import { fetchProjects } from '../../graphql/generated';

	let projects = fetchProjects({});
</script>

<Container class="mb-8">
	<Typography variant="h2" class="mb-4">{$t('home.featured-projects')}</Typography>
	{#if projects}
		{#if $projects.loading}
			Loading...
		{:else if $projects.error}
			Error: {$projects.error.message}
		{:else if $projects.data.projects?.data && $projects.data.projects.data.length > 0}
			<div class="flex flex-row ">
				{#each $projects.data?.projects.data as project}
					<div class="w-1/3 p-2 card">
						<div class="bg-white shadow-md rounded-md w-full h-full px-2 py-4 ">
							<p>{project.attributes?.title}</p>
							{#if project.attributes?.description}
								<p>{project.attributes?.description}</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			Projects not found
		{/if}
	{/if}
</Container>

<style lang="scss">
	.card {
		height: 300px;
	}
</style>
