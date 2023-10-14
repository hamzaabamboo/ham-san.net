<script lang="ts">
	let _class = '';
	let _style = '';
	$: hasColor = /bg-.*?-\d{3}/.test(_class);
	export { _class as class, _style as style };
</script>

<div
	{...$$restProps}
	class="py-1 px-2 text-sm rounded-lg {!hasColor && 'bg-gray-100'} {_class || ''}"
	style={_style}
>
	<slot />
</div>
