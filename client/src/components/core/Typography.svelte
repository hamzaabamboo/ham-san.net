<script lang="ts">
	export let variant: TypographyVariant = 'body';
	type TypographyVariant = 'title' | 'h2' | 'subtitle' | 'body' | 'body 2';

	let _class = '';
	export { _class as class };
</script>

{#if variant === 'title'}
	<h1 {...$$restProps} class="text-5xl mb-2 {_class || ''}">
		<slot />
	</h1>
{:else if variant === 'h2'}
	<h2 {...$$restProps} class="text-3xl {_class || ''}">
		<slot />
	</h2>
{:else if variant === 'subtitle'}
	<p {...$$restProps} class="text-gray-200 {_class || ''}">
		<slot />
	</p>
{:else}
	<p {...$$restProps} class={_class || ''}>
		<slot />
	</p>
{/if}
