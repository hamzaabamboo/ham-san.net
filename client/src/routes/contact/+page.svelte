<script lang="ts">
	import { t } from '@i18n';
	import Typography from '@components/core/Typography.svelte';
	import Container from '@components/core/Container.svelte';
</script>

<svelte:head>
	<title>{$t('common.name')} | {$t('common.contact')}</title>
</svelte:head>

<Container class="pt-8">
	<Typography variant="h1">{$t('common.contact')}</Typography>
	<Typography>{$t('contact.email')}: hamzaabamboo@gmail.com</Typography>
	<Typography>{$t('contact.phone')}: (+66) 066-112-4125</Typography>
	<Typography>{$t('contact.twitter')}: @HamP_punipuni</Typography>
	<Typography>{$t('contact.github')}: hamzaabamboo</Typography>
</Container>
