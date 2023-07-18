<script lang="ts">
	export let variant: TypographyVariant = 'body';
	type TypographyVariant =
		| 'title'
		| 'h1'
		| 'h2'
		| 'h3'
		| 'h4'
		| 'h5'
		| 'h6'
		| 'subtitle'
		| 'body'
		| 'body 2';

	let _class = '';
	let _id: string | undefined = undefined;
	$: hasMargin = /m.*-\d{0,3}/.test(_class);
	$: hasColor = /text-.*?-\d{3}/.test(_class);
	export { _class as class, _id as id };
</script>

{#if variant === 'title'}
	<h1
		{...$$restProps}
		class="text-5xl {!hasMargin && 'mb-4'} {_class || ''}"
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
	>
		<slot />
	</h1>
{:else if variant === 'h1'}
	<h1
		{...$$restProps}
		class="text-4xl {!hasMargin && 'mb-3'}  {_class || ''}"
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
	>
		<slot />
	</h1>
{:else if variant === 'h2'}
	<h2
		{...$$restProps}
		class="text-3xl {!hasMargin && 'mb-2'}  {_class || ''}"
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
	>
		<slot />
	</h2>
{:else if variant === 'h3'}
	<h2
		{...$$restProps}
		class="text-2xl {!hasMargin && 'mb-2'}  {_class || ''}"
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
	>
		<slot />
	</h2>
{:else if variant === 'h4'}
	<h4
		{...$$restProps}
		class="text-xl {!hasMargin && 'mb-2'}  {_class || ''}"
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
	>
		<slot />
	</h4>
{:else if variant === 'h5'}
	<h5
		{...$$restProps}
		class="text-lg {!hasMargin && 'mb-2'}  {_class || ''}"
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
	>
		<slot />
	</h5>
{:else if variant === 'h6'}
	<h4
		{...$$restProps}
		class="text-lg {!hasMargin && 'mb-2'}  {_class || ''}"
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
	>
		<slot />
	</h4>
{:else if variant === 'subtitle'}
	<p
		{...$$restProps}
		class="{!hasColor && 'text-gray-500'} {_class || ''}"
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
	>
		<slot />
	</p>
{:else if variant === 'body'}
	<p
		{...$$restProps}
		class="{!hasMargin && 'mb-2'} {_class || ''} text-justify"
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
	>
		<slot />
	</p>
{:else}
	<p
		{...$$restProps}
		class="{!hasMargin && 'mb-1'} {_class || ''}"
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
	>
		<slot />
	</p>
{/if}
