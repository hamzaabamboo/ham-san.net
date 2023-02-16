<script>
	import { getMediaUrl } from "@utils/media";


	export let href = '';
	export let title = undefined;
	export let text = '';
</script>

<div class="w-full flex object-fit-contain justify-center my-4">
	<img class="max-h-64" src={getMediaUrl(href)} {title} alt={text} />
</div>
