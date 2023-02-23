<script lang="ts">
	export let fluid = false;

	let _class = '';
	export { _class as class };
</script>

<div class="w-full {!fluid ? 'lg:w-4/5 px-2' : ''} mx-auto {_class || ''}">
	<slot />
</div>
