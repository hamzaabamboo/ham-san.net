<script lang="ts">
	let _class = '';
	export { _class as class };
</script>

<div {...$$restProps} class="py-1 px-2 text-sm rounded-lg bg-gray-100 {_class || ''}">
	<slot />
</div>
