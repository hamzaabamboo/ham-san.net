<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '@i18n';
	import Container from '@components/core/Container.svelte';
	import Typography from '@components/core/Typography.svelte';

	const messages: Record<number, string> = {
		404: $t('common.page-not-found'),
		500: $t('common.something-went-wrong')
	};

	const images: Record<number, string> = {
		404: 'https://1.bp.blogspot.com/-4bgWpFWOla8/W-0g9Mtf1GI/AAAAAAABQOA/YQcj9BrxPPA9upzGM48m1oVUC_zI5pErgCLcBGAs/s400/megane_sagasu_man.png',
		500: 'https://1.bp.blogspot.com/-q1F1HRdihGQ/UylAT4h4nhI/AAAAAAAAeR4/bwQkXPSVZHU/s400/bakuhatsu_kaden.png'
	};

	$: message = messages[$page.status] ?? messages[500];
	$: image = images[$page.status] ?? images[500];
</script>

<Container class="pt-12 flex flex-col justify-center">
	<Typography variant="h1" class="mb-4 text-center">{message}</Typography>
	<img src={image} alt={message} class="h-auto w-64 mx-auto" />
</Container>
