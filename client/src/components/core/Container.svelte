<script lang="ts">
	export let fluid = false;

	let _class = '';
	let _id: string | undefined = undefined;

	export { _class as class, _id as id };
</script>

<div
	id={_id}
	class="w-full {!fluid ? 'lg:w-4/5 px-4' : ''} mx-auto {_class || ''}"
	style:transform-style="preserve-3d"
>
	<slot />
</div>
