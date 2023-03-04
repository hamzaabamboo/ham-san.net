<script lang="ts">
	import Pill from '@components/core/Pill.svelte';
	import type { Tag } from '@graphql/generated/client';

	export let tag: Tag;

	let _class = '';
	export { _class as class };

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

<a href="/tags/{tag?.slug}" class="block"
	><Pill class="{color} {_class || ''}">{tag?.title}</Pill></a
>
