<script lang="ts">
	import Container from '@components/core/Container.svelte';
	import MetaTags from '@components/core/MetaTags.svelte';
	import Typography from '@components/core/Typography.svelte';
	import { t } from '@i18n';
</script>

<MetaTags title="{$t('common.contact')} | Dashboard" path="dashboard" />

<Container class="pt-8">
	<Typography variant="h1" class="mb-2">Dashboard</Typography>
</Container>
