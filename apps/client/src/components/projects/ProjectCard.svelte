<script lang="ts">
  import Typography from '@components/core/Typography.svelte';
  import TagItem from '@components/tags/TagItem.svelte';
  import type { ProjectPreviewFragment } from '@graphql/generated/client';
  import { locale, t } from '@i18n';
  import { getMediaUrl } from '@utils/media';
  import { sortTags } from '@utils/tags';
  import { formatMonthYear, parseDate } from 'utils/date';

  export let project: Pick<
    ProjectPreviewFragment,
    'title' | 'media' | 'description' | 'slug' | 'date' | 'tags' | 'category'
  >;

  let _class = '';
  $: subtitle = [
    project?.date ? formatMonthYear(parseDate(project?.date), $locale) : null,
    project?.category?.data?.attributes?.name
  ]
    .filter((f) => !!f)
    .join(' | ');

  export { _class as class };
</script>

<a href="/projects/{project.slug}" class="block md:min-h-[250px] {_class || ''}">
  <div
    class=" bg-white shadow-md rounded-md flex flex-col h-full transtion-shadow transition-transform hover:shadow-lg hover:scale-105"
  >
    {#if project.media?.data[0]?.attributes?.url}
      <div
        class="rounded-t-md bg-cover bg-center bg-no-repeat h-64"
        style:background-image="url('{getMediaUrl(project.media?.data[0]?.attributes?.url, {
          height: 400
        })}')"
      />
    {/if}
    <div class="w-full h-full flex-1 p-2">
      <Typography variant="h5" class="mb-1 text-bold">{project.title}</Typography>
      {#if subtitle}<Typography variant="subtitle" class="mb-1">{subtitle}</Typography>{/if}
      {#if project.tags?.data && project.tags?.data?.length > 0}
        <div class="flex items-center flex-wrap">
          <Typography variant="subtitle" class="mr-2">{$t('common.tags')}:</Typography>
          {#each sortTags(project?.tags?.data) as tag}
            {#if tag.attributes}
              <TagItem tag={tag?.attributes} class="mr-1 my-1" />
            {/if}
          {/each}
        </div>
      {/if}
      {#if project.description}
        <p>{project.description}</p>
      {/if}
    </div>
  </div>
</a>
