<script lang="ts">
	export let variant: TypographyVariant = 'body';
	type TypographyVariant =
		| 'title'
		| 'h1'
		| 'h2'
		| 'h4'
		| 'h5'
		| 'h6'
		| 'subtitle'
		| 'body'
		| 'body 2';

	let _class = '';
	$: hasMargin = /m.*-\d{0,3}/.test(_class);
	$: hasColor = /text-.*?-\d{3}/.test(_class);
	export { _class as class };
</script>

{#if variant === 'title'}
	<h1 {...$$restProps} class="text-5xl {!hasMargin && 'mb-2'} {_class || ''}">
		<slot />
	</h1>
{:else if variant === 'h1'}
	<h1 {...$$restProps} class="text-4xl {!hasMargin && 'mb-2'}  {_class || ''}">
		<slot />
	</h1>
{:else if variant === 'h2'}
	<h2 {...$$restProps} class="text-3xl {!hasMargin && 'mb-2'}  {_class || ''}">
		<slot />
	</h2>
{:else if variant === 'h4'}
	<h4 {...$$restProps} class="text-xl {!hasMargin && 'mb-2'}  {_class || ''}">
		<slot />
	</h4>
{:else if variant === 'h5'}
	<h5 {...$$restProps} class="text-lg {!hasMargin && 'mb-2'}  {_class || ''}">
		<slot />
	</h5>
{:else if variant === 'h6'}
	<h4 {...$$restProps} class="text-lg {!hasMargin && 'mb-2'}  {_class || ''}">
		<slot />
	</h4>
{:else if variant === 'subtitle'}
	<p {...$$restProps} class="{!hasColor && 'text-gray-500'} {_class || ''}">
		<slot />
	</p>
{:else if variant === 'body'}
	<p {...$$restProps} class="{!hasMargin && 'mb-2'} {_class || ''} text-justify">
		<slot />
	</p>
{:else}
	<p {...$$restProps} class="{!hasMargin && 'mb-2'} {_class || ''}">
		<slot />
	</p>
{/if}
