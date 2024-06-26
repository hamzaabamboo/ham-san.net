<script lang="ts">
  import Container from '@components/core/Container.svelte';
  import MetaTags from '@components/core/MetaTags.svelte';
  import Typography from '@components/core/Typography.svelte';
  import MarkdownRenderer from '@components/markdown/MarkdownRenderer.svelte';
  import ProjectCard from '@components/projects/ProjectCard.svelte';
  import { locale, t } from '@i18n';
  import { min } from 'date-fns';
  import { formatDistanceToNow, formatMonthYear, parseDate } from 'utils/date';
  import type { PageServerData } from './$types';

  export let data: PageServerData;

  $: tag = data.data?.tags?.data?.[0]?.attributes;
  $: experiences = tag?.experiences?.data;
  $: projects = tag?.projects?.data;

  $: usedSince = min(
    [
      ...(experiences?.map((e) => e.attributes?.start) ?? []),
      ...(projects?.map((p) => p.attributes?.date) ?? [])
    ].map((d) => parseDate(d))
  );

  $: formatDate = (date?: string) => (date ? formatMonthYear(parseDate(date), $locale) : null);
</script>

<MetaTags title="{tag?.title}| {$t('common.name')}" path="tags/{tag?.slug}" />

<Container class="pt-12">
  <Typography variant="title">{tag?.title}</Typography>
  <Typography variant="subtitle">
    {$t('common.used-since', { usedSince: formatMonthYear(usedSince, $locale) })} ({formatDistanceToNow(
      usedSince,
      $locale
    )})</Typography
  >
  {#if experiences && experiences?.length > 0}
    <Typography variant="h4" class="mb-2">{$t('common.experiences')}</Typography>
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
  <hr class="mb-4" />
  <Typography variant="h4">{$t('common.projects')}</Typography>
  <div class="flex flex-row flex-wrap mb-2">
    {#if projects?.length && projects.length > 0}
      {#each projects as project}
        <ProjectCard project={project.attributes} class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2" />
      {/each}
    {:else}
      Projects not found
    {/if}
  </div>
</Container>
