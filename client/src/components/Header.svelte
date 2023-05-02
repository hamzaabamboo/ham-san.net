<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { locale, t } from '@i18n';
	import { localizationUrls } from '@stores/localizationUrls';
	import { LANGUAGES } from '@utils/localization';
	import Fa from 'svelte-fa';
	import { faBars } from '@fortawesome/free-solid-svg-icons';

	let menuOpen = false;

	import { afterNavigate } from '$app/navigation';
	import Logo from './core/Logo.svelte';

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
		// { label: $t('common.hobbies'), href: '/hobbies' },
		{ label: $t('common.blog'), href: '/blog' },
		{ label: $t('common.contact'), href: '/contact' }
	];
</script>

<!-- bind:this={navbar} -->
<nav
	class="w-full h-12 flex items-center justify-between px-4 sticky top-0 bg-primary shadow-sm z-20"
>
	<!-- Logo Section -->
	<div class="w-full md:w-auto relative z-20">
		<!-- <Logo /> -->
		<a href="/">{$t('common.name')}</a>
	</div>

	<!-- Desktop Menu-->
	<div class="items-center hidden md:flex">
		<div>
			{#each links as link}
				<a href={link.href} class="p-2">{link.label}</a>
			{/each}
		</div>
		<div class="px-2">|</div>
		<div>
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
		</div>
	</div>

	<!-- Mobile Menu-->
	<div class="items-center flex relative z-20 md:hidden" on:click={() => (menuOpen = !menuOpen)}>
		<Fa icon={faBars} size="md" />
	</div>
	<div
		class="fixed w-full h-full z-10 transition-all bg-white top-0 pt-16 md:hidden"
		class:-right-full={!menuOpen}
		class:right-0={menuOpen}
	>
		<div class="flex flex-col justify-center px-2 text-center">
			{#each links as link}
				<a href={link.href} class="p-2" on:click={() => (menuOpen = false)}>{link.label}</a>
			{/each}
			<hr />
			<div class="pt-4">
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
			</div>
		</div>
	</div>
</nav>
