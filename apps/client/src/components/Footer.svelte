<script>
  import { t } from '@i18n';
  import Typography from './core/Typography.svelte';
</script>

<div
  class="w-full py-2 flex justify-center items-center bg-primary-400 shadow-md"
  style="view-transition-name: footer"
>
  <Typography class="mb-0"
    ><span class="mr-2">{$t('common.copyright')}</span> |
    <a
      target="_blank"
      rel="noreferrer"
      href="https://github.com/hamzaabamboo/ham-san.net"
      class="ml-2">{$t('common.view-source')}</a
    ></Typography
  >
</div>
