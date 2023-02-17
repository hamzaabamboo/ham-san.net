<script lang="ts">
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';
	import { t } from '@i18n';
	import { getMediaUrl } from '@utils/media';
	import { fetchProjects } from '../../graphql/generated/client';

	let projects = fetchProjects({ limit: 3, isFeatured: true });
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
					<a class="sm:w-1/2 lg:w-1/3 p-2 " href="/projects/{project.attributes?.slug}">
						<div class="rounded-md flex flex-col h-full">
							{#if project.attributes?.media?.data[0]?.attributes?.url}
								<div
									class="bg-cover bg-no-repeat h-64 "
									style:background-image="url('{getMediaUrl(
										project.attributes?.media?.data[0]?.attributes?.url
									)}')"
								/>
							{/if}
							<div class="bg-white shadow-md w-full h-full flex-1 p-2 ">
								<Typography variant="h4">{project.attributes?.title}</Typography>
								{#if project.attributes?.description}
									<p>{project.attributes?.description}</p>
								{/if}
							</div>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			Projects not found
		{/if}
	{/if}
</Container>

<style lang="scss">
</style>
