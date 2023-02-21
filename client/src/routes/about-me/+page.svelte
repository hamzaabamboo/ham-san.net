<script lang="ts">
	import { t } from '@i18n';
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Container class="pt-8 flex justify-center">
	<Typography variant="h1">{$t('common.under-construction')}</Typography>
	{JSON.stringify(data)}
</Container>
