<script lang="ts">
  import type { ComponentUtilsLink } from '@graphql/generated/client';
  import Typography from './Typography.svelte';

  import { faGithub } from '@fortawesome/free-brands-svg-icons';
  import { faGlobe, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  export let link: ComponentUtilsLink;
  export let icon: IconDefinition | undefined;

  const processUrl = (link: ComponentUtilsLink) => {
    switch (link.type) {
      case 'github':
        return link.url?.split('github.com/').splice(-1)[0];
      default:
        return link.url;
    }
  };

  const linkIcon = (link: ComponentUtilsLink) => {
    if (icon) return icon;
    switch (link.type) {
      case 'github':
        return faGithub;
      case 'web':
        return faGlobe;
      default:
        return null;
    }
  };
</script>

<Typography>
  {#if linkIcon(link)}
    <Fa size="lg" icon={linkIcon(link)} class="inline mr-1" />
  {:else}{link?.title}{/if}:
  <a target="_blank" rel="noreferrer" class="text-blue-400 underline" href={link?.url}
    >{processUrl(link)}</a
  >
</Typography>
