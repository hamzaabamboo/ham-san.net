<script lang="ts">
	import { t } from '@i18n';
	import Typography from '@components/core/Typography.svelte';
	import Container from '@components/core/Container.svelte';
	import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
	import { faGithub, faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
	import Fa from 'svelte-fa';
	import MetaTags from '@components/utils/MetaTags.svelte';

	$: items = [
		{
			label: $t('contact.email'),
			value: 'hamzaabamboo@gmail.com',
			url: 'mailto:hamzaabamboo@gmail.com',
			icon: faEnvelope
		},
		{
			label: $t('contact.phone'),
			value: '(+66) 066-112-4125',
			url: 'tel:+66661124125',
			icon: faPhone
		},
		{
			label: $t('contact.twitter'),
			value: '@HamP_punipuni',
			url: 'https://twitter.com/HamP_punipuni',
			icon: faTwitter
		},
		{
			label: $t('contact.github'),
			value: 'hamzaabamboo',
			url: 'https://github.com/hamzaabamboo',
			icon: faGithub
		},
		{
			label: $t('contact.linkedin'),
			value: 'tvittayapalotai',
			url: 'https://www.linkedin.com/in/tvittayapalotai/',
			icon: faLinkedin
		},
		{
			label: $t('contact.facebook'),
			value: 'hamPpunipuni',
			url: 'https://www.facebook.com/hamPpunipuni',
			icon: faFacebook
		}
	];
</script>

<MetaTags title="{$t('common.contact')} | {$t('common.name')}" path="contact" />

<Container class="pt-8">
	<Typography variant="h1" class="mb-2">{$t('common.contact')}</Typography>
	{#each items as item}
		<Typography>
			{#if item.icon}
				<Fa size="lg" icon={item.icon} class="inline mr-1" /> {item.label}
			{:else}{item.label}{/if}:
			{#if item.url}
				<a target="_blank" rel="noreferrer" class="text-blue-400 underline" href={item.url}
					>{item.value}</a
				>
			{:else}{item.value}{/if}
		</Typography>
	{/each}
</Container>
