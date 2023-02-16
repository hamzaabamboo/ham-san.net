<script lang="ts">
	export let variant: TypographyVariant = 'body';
	type TypographyVariant = 'title' | 'h1' | 'h2' | 'h4' | 'subtitle' | 'body' | 'body 2';

	let _class = '';
	export { _class as class };
</script>

{#if variant === 'title'}
	<h1 {...$$restProps} class="text-5xl mb-2 {_class || ''}">
		<slot />
	</h1>
{:else if variant === 'h1'}
	<h1 {...$$restProps} class="text-4xl mb-2 {_class || ''}">
		<slot />
	</h1>
{:else if variant === 'h2'}
	<h2 {...$$restProps} class="text-3xl mb-2 {_class || ''}">
		<slot />
	</h2>
{:else if variant === 'h4'}
	<h4 {...$$restProps} class="text-xl mb-2 {_class || ''}">
		<slot />
	</h4>
{:else if variant === 'subtitle'}
	<p {...$$restProps} class="text-gray-200 {_class || ''}">
		<slot />
	</p>
{:else}
	<p {...$$restProps} class="mb-2 {_class || ''} text-justify">
		<slot />
	</p>
{/if}
