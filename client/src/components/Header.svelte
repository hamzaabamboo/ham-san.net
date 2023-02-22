<script lang="ts">
	import { goto } from '$app/navigation';
	import { locale, t } from '@i18n';
	import { localizationUrls } from '@stores/localizationUrls';
	import { LANGUAGES } from '@utils/localization';

	const handleChangeLanguage = (language: (typeof LANGUAGES)[number]) => {
		locale.set(language);
		fetch('/?/set-language', {
			method: 'POST',
			body: `language=${language}`,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
	};

	$: links = [
		{ label: $t('common.about-me'), href: '/about-me' },
		{ label: $t('common.projects'), href: '/projects' },
		// { label: $t('common.hobbies'), href: '/hobbies' },
		// { label: $t('common.blog'), href: '/blog' },
		{ label: $t('common.contact'), href: '/contact' }
	];
</script>

<div class="w-full h-12 flex items-center justify-between px-2 sticky top-0 bg-primary shadow-sm">
	<a href="/">{$t('common.name')}</a>
	<div class="flex items-center">
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
</div>
