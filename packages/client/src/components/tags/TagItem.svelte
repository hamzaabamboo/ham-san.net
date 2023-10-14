<script lang="ts">
	import Pill from '@components/core/Pill.svelte';
	import type { Tag } from '@graphql/generated/client';

	export let tag: Tag;
	export let showProjectCount = false;

	let _class = '';

	let _id: string | undefined = undefined;
	export { _class as class, _id as id };

	$: getColor = () => {
		switch (tag.type) {
			case 'Frontend':
				return 'bg-blue-300';
			case 'Backend':
				return 'bg-red-200';
			case 'Database':
				return 'bg-orange-200';
			case 'Programming_Language':
				return 'bg-green-200';
			case 'DevOps':
				return 'bg-purple-200';
			case 'Others':
				return 'bg-gray-300';
			case 'Non_Dev':
				return 'bg-gray-200';
		}
	};

	$: color = getColor();
</script>

<!-- <a href="/tags/{tag?.slug}" class="block"> -->
<Pill class="{color} {_class || ''}" style={_id ? `view-transition-name: ${_id};` : ''}
	>{tag?.title}
	{#if showProjectCount && tag.projects?.data.length && tag.projects?.data.length > 0}({tag.projects
			?.data.length}){/if}</Pill
>
<!-- </a> -->
