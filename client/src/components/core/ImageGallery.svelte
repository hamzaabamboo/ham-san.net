<script lang="ts">
	import Carousel from 'svelte-carousel';
	import { getMediaUrl } from '@utils/media';
	import type { UploadFileEntity } from '@graphql/generated/client';

	export let media: Partial<UploadFileEntity>[];

	let carousel: Carousel;
</script>

<div>
	<div class="mb-2">
		<Carousel bind:this={carousel}>
			{#each media as image}
				<div class="w-1/3">
					<img
						src={getMediaUrl(image?.attributes?.url, { height: 400 })}
						alt={image?.attributes?.name}
						class="mx-auto"
						style:max-height="400px"
					/>
				</div>
			{/each}
		</Carousel>
	</div>
	<div class="flex flex-row flex-wrap justify-center">
		{#each media as image, index}
			<div
				class="w-24 h-24 border mx-2 px-2 flex align-center transition-transform hover:scale-110"
				on:click={() => carousel.goTo(index)}
			>
				<img
					src={getMediaUrl(image?.attributes?.url, { width: 100, height: 100 })}
					alt={image?.attributes?.name}
					class="max-w-full max-h-full my-auto"
					style:max-height="400px"
				/>
			</div>
		{/each}
	</div>
</div>
