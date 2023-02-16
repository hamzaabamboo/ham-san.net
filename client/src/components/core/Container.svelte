<script lang="ts">
	export let fluid = false;

	let _class = '';
	export { _class as class };
</script>

<div class="sm:w-full sm:px-4 {!fluid ? 'lg:w-4/5' : ''} mx-auto {_class || ''}">
	<slot />
</div>
