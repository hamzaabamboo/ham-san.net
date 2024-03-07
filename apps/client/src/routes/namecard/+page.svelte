<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import kaho1 from '@assets/kaho-1.png';
  import kanataPeek from '@assets/kanata-peek.png';
  import Container from '@components/core/Container.svelte';
  import MetaTags from '@components/core/MetaTags.svelte';
  import Typography from '@components/core/Typography.svelte';
  import { faDiscord, faGithub, faLastfm, faSpotify, faXTwitter } from '@fortawesome/free-brands-svg-icons';
  import { faHouse, faLink, faList } from '@fortawesome/free-solid-svg-icons';
  import { locale, t } from '@i18n';
  import { LANGUAGES } from '@utils/localization';
  import Fa from 'svelte-fa';

  $: items = [
    {
      label: $t('contact.twitter'),
      value: '@HamP_punipuni',
      url: 'https://twitter.com/HamP_punipuni',
      icon: faXTwitter
    },
    {
      label: 'Discord',
      value: 'hamp',
      url: 'https://discordapp.com/users/260776161032798208',
      icon: faDiscord
    },
    {
      label: 'Eventernote',
      value: 'HamP_punipuni',
      url: 'https://www.eventernote.com/users/HamP_punipuni',
      icon: faLink
    },
    {
      label: $t('contact.github'),
      value: 'hamzaabamboo',
      url: 'https://github.com/hamzaabamboo',
      icon: faGithub
    },
    {
      label: $t('name-card.tierlist'),
      url: 'https://tiermaker.com/list/actors-actresses/love-live-seiyuu-2023-15476088/3747761',
      icon: faList,
      value: $t('name-card.tierlist-description')
    },
    {
      label: $t('name-card.home'),
      url: '/',
      icon: faHouse
    },
    {
      label: 'Spotify',
      url: 'https://open.spotify.com/user/dick8a92koqqd6ti4sqtz40co?si=3c9b1b72a71a47be',
      icon: faSpotify
    },
    {
      label: 'last.fm',
      url: 'https://www.last.fm/user/Betcrg',
      icon: faLastfm
    }
    // Link Like Lovelive, SIF2, Starlight, Deresute, ID...
  ];

  const handleChangeLanguage = (language: (typeof LANGUAGES)[number]) => {
    locale.set(language);
    fetch('/?/set-language', {
      method: 'POST',
      body: `language=${language}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(() => invalidateAll());
  };

  const getLanguageLabel = (lang: string) => {
    return { en: 'English', ja: '日本語' }[lang];
  };
</script>

<MetaTags title="{$t('common.name-card')} | {$t('common.name')}" path="contact" />

<div class=" pt-8 flex flex-col w-full h-full items-center">
  <div
    class="fixed top-0 left-0 w-full h-full bg-hasu bg-no-repeat bg-cover bg-center blur-sm"
  ></div>
  <Container>
    <div class="p-4 rounded-md bg-white/50 flex flex-col w-full h-full gap-4 items-stretch">
      <div class="flex flex-col w-full gap-1">
        <div class="w-full flex flex-row justify-end gap-2">
          {#each LANGUAGES as language}
            <button
              class="p-1 text-sm bg-name-card-100 transition-colors hover:bg-name-card-200 rounded-md data-[selected]:bg-name-card-300 data-[selected]:font-semibold"
              data-selected={language === $locale ? 'true' : undefined}
              on:click={() => handleChangeLanguage(language)}
            >
              {getLanguageLabel(language)}</button
            >
          {/each}
        </div>
        <Typography variant="h1" class="w-full text-center font-bold"
          >{$t('name-card.name')}</Typography
        >
      </div>

      <Typography variant="subtitle" class="text-sm text-center whitespace-pre-wrap"
        >{$t('name-card.subtitle')}</Typography
      >
      <Typography variant="body" class="mb-2 text-center">{$t('name-card.message')}</Typography>
      <div
        class="grid gap-2 items-stretch"
        style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));"
      >
        {#each items as item}
          <a target="_blank" rel="noreferrer" class="grid-item h-full" href={item.url}>
            <div
              class="h-full gap-1 p-4 rounded-md flex flex-col items-center justify-center transition-colors hover:bg-name-card-200 bg-name-card-100 text-black"
            >
              {#if item.icon}
                <Fa size="2x" icon={item.icon} class=" text-name-card-600 inline mr-1 text-2xl" />
              {/if}
              <div class="flex flex-col gap-1 items-center">
                <Typography class="font-bold m-0">
                  {item.label}
                </Typography>
                {#if item.value}
                  <Typography class="m-0 text-name-card-800">
                    {item.value}
                  </Typography>
                {/if}
              </div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </Container>
  <div class="w-full overflow-hidden flex-1 min-h-[360px] relative">
    <div class="animate-pyon top-0 right-0 absolute">
      <img class="w-[400px] translate-x-[15%]" src={kaho1} alt="日野下花帆" />
    </div>
    <div class="fixed bottom-0 left-0 overflow-hidden">
      <img class="animate-kanatapeek scale-x-[-100%]" src={kanataPeek} alt="彼方このえ" />
    </div>
  </div>
</div>
