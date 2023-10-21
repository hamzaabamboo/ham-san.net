<script lang="ts">
	import { t } from '@i18n';
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';
	import MetaTags from '@components/utils/MetaTags.svelte';
</script>

<MetaTags title="{$t('common.tags')} | {$t('common.name')}" path="tags" />

<Container class="pt-8 flex justify-center">
	<Typography variant="h1">{$t('common.under-construction')}</Typography>
</Container>
