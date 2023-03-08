<script lang="ts">
	import { t } from '@i18n';
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';
	import MetaTags from '@components/core/MetaTags.svelte';
</script>

<MetaTags title="{$t('common.blog')} | {$t('common.name')}" path="blog" />

<Container class="pt-8 flex justify-center">
	<Typography variant="h1">{$t('common.under-construction')}</Typography>
</Container>
