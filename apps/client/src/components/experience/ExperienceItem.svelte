<script lang="ts">
	import Typography from '@components/core/Typography.svelte';
	import MarkdownRenderer from '@components/markdown/MarkdownRenderer.svelte';
	import TagItem from '@components/tags/TagItem.svelte';
	import type { Experience } from '@graphql/generated/client';
	import { locale, t } from '@i18n';
	import { formatMonthYear, parseDate } from '@utils/date';
	import { sortTags } from '@utils/tags';

	export let experience: Experience;

	$: formatDate = (date?: string) => (date ? formatMonthYear(parseDate(date), $locale) : null);
</script>

<div class="flex flex-col mb-2">
	<Typography variant="h4" class="mb-1">{experience?.title}</Typography>
	<div class="flex flex-row mb-2">
		<Typography variant="subtitle" class="mr-2"
			>{[
				experience?.position,
				experience?.description,
				`${formatDate(experience?.start)} - ${formatDate(experience?.end) ?? $t('common.present')}`
			]
				.filter((i) => !!i)
				.join(' | ')}</Typography
		>
	</div>
	{#if experience.tags?.data && experience.tags?.data?.length > 0}
		<div class="flex items-center flex-wrap">
			<Typography variant="subtitle" class="mr-2">{$t('common.tags')}:</Typography>
			{#each sortTags(experience?.tags?.data) as tag}
				{#if tag}<TagItem tag={tag.attributes} class="mr-1 my-1" />{/if}
			{/each}
		</div>
	{/if}
	{#if experience?.content}
		<MarkdownRenderer content={experience?.content} />
	{/if}
</div>
