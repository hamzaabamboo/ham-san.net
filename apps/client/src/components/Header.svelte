<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { faBars } from '@fortawesome/free-solid-svg-icons';
	import { locale, t } from '@i18n';
	import { localizationUrls } from '@stores/localizationUrls';
	import { LANGUAGES } from '@utils/localization';
	import { hstack } from 'styled-system/patterns';
	import Fa from 'svelte-fa';
	import Box from './core/Box.svelte';
	import Divider from './core/Divider.svelte';
	import HStack from './core/HStack.svelte';
	import Stack from './core/Stack.svelte';

	let menuOpen = false;

	// let navbar: HTMLElement;

	const handleChangeLanguage = (language: (typeof LANGUAGES)[number]) => {
		locale.set(language);
		fetch('/?/set-language', {
			method: 'POST',
			body: `language=${language}`,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(() => invalidateAll());
		if (menuOpen) menuOpen = false;
	};

	$: links = [
		{ label: $t('common.home'), href: '/' },
		{ label: $t('common.about-me'), href: '/about' },
		{ label: $t('common.projects'), href: '/projects' },
		{ label: $t('common.note'), href: '/notes' },
		// { label: $t('common.hobbies'), href: '/hobbies' },
		// { label: $t('common.blog'), href: '/blog' },
		{ label: $t('common.contact'), href: '/contact' }
	];
</script>

<!-- "w-full h-12 flex items-center justify-between sticky bg-primary top-0 shadow-sm z-20" -->
<!-- bind:this={navbar} -->
<nav
	class={hstack({
		w: 'full',
		h: 12,
		alignItems: 'center',
		justifyContent: 'space-between',
		position: 'sticky',
		bgColor: 'orange',
		top: 0,
		shadow: 'sm',
		zIndex: '20'
	})}
>
	<HStack
		styles={{
			alignItems: 'center',
			justifyContent: 'space-between',
			px: '4',
			zIndex: '20',
			viewTransitionName: 'header'
		}}
	>
		<!-- Logo Section -->
		<Box styles={{ w: { base: 'full', md: 'auto' }, position: 'relative', zIndex: '20' }}>
			<!-- <Logo /> -->
			<a href="/">{$t('common.name')}</a>
		</Box>

		<!-- Desktop Menu-->
		<HStack styles={{ hideBelow: 'md' }}>
			<Box>
				{#each links as link}
					<a href={link.href} class="p-2">{link.label}</a>
				{/each}
			</Box>
			<Box class="px-2">|</Box>
			<Box>
				{#each LANGUAGES as language}
					{#if $localizationUrls[language]}
						<a
							class="px-1"
							href={$localizationUrls[language]}
							on:click={() => handleChangeLanguage(language)}
							>{language.toUpperCase()}
						</a>
					{:else}
						<button class="px-1" on:click={() => handleChangeLanguage(language)}>
							{language.toUpperCase()}</button
						>
					{/if}
				{/each}
			</Box>
		</HStack>
		<!-- Mobile Menu-->
		<HStack
			styles={{
				alignItems: 'center',
				position: 'relative',
				zIndex: 20,
				hideFrom: 'md',
				fontSize: 'md'
			}}
			on:click={() => (menuOpen = !menuOpen)}
		>
			<Fa icon={faBars} />
		</HStack>
	</HStack>
	<Box
		styles={{
			position: 'fixed',
			width: 'full',
			height: 'full',
			zIndex: '10',
			transition: 'all',
			bgColor: 'white',
			top: '0',
			pt: '4',
			right: menuOpen ? 'full' : '0',
			hideFrom: 'md'
		}}
	>
		<Stack style={{ px: '2', textAlign: 'center' }}>
			{#each links as link}
				<a href={link.href} class="p-2" on:click={() => (menuOpen = false)}>{link.label}</a>
			{/each}
			<Divider />
			<HStack class="pt-4">
				{#each LANGUAGES as language}
					{#if $localizationUrls[language]}
						<a
							class="px-1"
							href={$localizationUrls[language]}
							on:click={() => handleChangeLanguage(language)}
							>{language.toUpperCase()}
						</a>
					{:else}
						<button class="px-1" on:click={() => handleChangeLanguage(language)}>
							{language.toUpperCase()}</button
						>
					{/if}
				{/each}
			</HStack>
		</Stack>
	</Box>
</nav>
