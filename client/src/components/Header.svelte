<script lang="ts">
	import { locale, t } from '@i18n';

	const languages = ['en', 'ja'];

	const handleChangeLanguage = (language: (typeof languages)[number]) => {
		locale.set(language);
	};

	$: links = [
		{ label: $t('common.about-me'), href: 'about-me' },
		{ label: $t('common.projects'), href: 'projects' },
		{ label: $t('common.hobbies'), href: 'hobbies' }
	];
</script>

<div class="w-screen h-12 flex items-center justify-between px-2 sticky top-0 bg-primary shadow-sm">
	<a href="/">{$t('common.name')}</a>
	<div class="flex items-center">
		<div>
			{#each links as link}
				<a href={link.href} class="p-2">{link.label}</a>
			{/each}
		</div>
		<div class="px-2">|</div>
		<div>
			{#each languages as language}
				<button class="px-1" on:click={() => handleChangeLanguage(language)}
					>{language.toUpperCase()}</button
				>
			{/each}
		</div>
	</div>
</div>
