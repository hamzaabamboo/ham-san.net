<script lang="ts">
	import { heading, type HeadingVariantProps } from 'styled-system/recipes';

	export let _as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h1';
	export let _id: string | undefined;

	export let styles: HeadingVariantProps = {};
	export { _as as as, _id as id };
</script>

{#if _as === 'h1'}
	<h1
		class={heading({ fontSize: '2xl', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</h1>
{:else if _as === 'h2'}
	<h2
		class={heading({ fontSize: 'xl', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</h2>
{:else if _as === 'h3'}
	<h2
		class={heading({ fontSize: 'lg', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</h2>
{:else if _as === 'h4'}
	<h4
		class={heading({ fontSize: 'md', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</h4>
{:else if _as === 'h5'}
	<h5
		class={heading({ fontSize: '2xl', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</h5>
{:else if _as === 'h6'}
	<h6
		class={heading({ fontSize: 'md', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</h6>
{:else}
	<h6
		class={heading({ fontSize: 'md', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</h6>
{/if}
