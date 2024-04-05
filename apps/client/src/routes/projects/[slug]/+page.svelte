<script lang="ts">
  import { browser } from '$app/environment';
  import Container from '@components/core/Container.svelte';
  import ImageGallery from '@components/core/ImageGallery.svelte';
  import LinkItem from '@components/core/LinkItem.svelte';
  import MetaTags from '@components/core/MetaTags.svelte';
  import Typography from '@components/core/Typography.svelte';
  import MarkdownRenderer from '@components/markdown/MarkdownRenderer.svelte';
  import TagItem from '@components/tags/TagItem.svelte';
  import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
  import { locale, t } from '@i18n';
  import { localizationUrls } from '@stores/localizationUrls';
  import { getMediaUrl } from '@utils/media';
  import debounce from 'lodash/debounce';
  import { onDestroy, onMount } from 'svelte';
  import Fa from 'svelte-fa';
  import { formatMonthYear, parseDate } from 'utils/date';
  import type { PageData } from './$types';

  export let data: PageData;

  $: project = data.data.projects?.data[0].attributes;
  $: title = project?.title;
  $: content = project?.content;
  $: banner = project?.banner?.data?.attributes?.url;
  $: tags = project?.tags?.data;
  $: links = project?.links;
  $: media = project?.media?.data;
  $: category = project?.category?.data?.attributes?.name;
  $: formattedDate = project?.date ? formatMonthYear(parseDate(project?.date), $locale) : null;

  $: {
    const localizationObj = Object.fromEntries(
      project?.localizations?.data.map(({ attributes }) => [
        attributes?.locale,
        attributes?.slug
      ]) ?? []
    );
    localizationUrls.set(localizationObj);
  }

  let bannerWidth: number;
  let maxBannerWidth: number = 0;

  $: updateWidth = debounce((newWidth) => {
    maxBannerWidth = newWidth > maxBannerWidth ? newWidth : maxBannerWidth;
  }, 500);
  $: updateWidth(bannerWidth);

  onMount(() => {
    maxBannerWidth = bannerWidth;
  });

  onDestroy(() => {
    localizationUrls.set({});
  });
</script>

<MetaTags
  title="{title} | {$t('common.name')}"
  description={project?.description ?? undefined}
  image={getMediaUrl(banner, { width: 1200 })}
  path="projects/{project?.slug}"
/>

{#if banner}
  <div
    class="bg-cover bg-center"
    bind:clientWidth={bannerWidth}
    style:height="400px"
    style:background-image={maxBannerWidth > 0
      ? `url('${getMediaUrl(banner, {
          height: 400,
          width: maxBannerWidth,
          fit: 'outside'
        })}')`
      : null}
    style:transform="translateZ(-2px) scale(1.8)"
  />
{/if}
<Container fluid class="bg-white flex-1 w-full">
  <Container class="py-8">
    <div class="mb-8">
      <div class="mb-2">
        <Typography class="font-sm font-gray-300"
          ><a href="/projects"
            ><Fa icon={faArrowLeft} class="inline mr-2" />{$t('project.back-to-projects')}
          </a></Typography
        >
      </div>
      <div class="mb-2">
        <Typography variant="title">{title}</Typography>
        {#if category}<Typography variant="subtitle" class="mb-2">{category}</Typography>{/if}
        {#if formattedDate}
          <Typography variant="subtitle"
            >{formattedDate}
            {#if project?.isActive}- {$t('common.present')}{/if}</Typography
          >
        {/if}
      </div>
      {#if links && links?.length > 0}
        <div class="flex flex-col">
          {#each links as link}
            <LinkItem {link} />
          {/each}
        </div>
      {/if}
      {#if tags && tags?.length > 0}
        <div class="flex items-center flex-wrap">
          <Typography variant="subtitle" class="mr-2">{$t('common.tags')}:</Typography>
          {#each tags as tag}
            {#if tag.attributes}<a href="/tags/{tag?.attributes.slug}" class="block"
                ><TagItem tag={tag?.attributes} class="mr-2" /></a
              >{/if}
          {/each}
        </div>
      {/if}
    </div>
    {#if content}
      <div class="my-8"><MarkdownRenderer {content} /></div>
    {/if}
    {#if browser && media && media.length > 0}
      <div>
        <Typography variant="h2" class="mb-4">{$t('project.screenshots')}</Typography>
        <ImageGallery {media} />
      </div>
    {/if}
  </Container>
</Container>
<Container fluid class="bg-primary-400 bg-opacity-10 h-64" />
