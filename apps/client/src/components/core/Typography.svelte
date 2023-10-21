<script lang="ts">
	import { css } from 'styled-system/css';
	import type { SystemStyleObject } from 'styled-system/types';
	export let variant = 'body';

	export let styles: SystemStyleObject = {};

	let _id: string | undefined = undefined;
	export { _class as class, _id as id };
</script>

{#if variant === 'title'}
	<h1
		class={css({ fontSize: '2xl', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</h1>
{:else if variant === 'h1'}
	<h1
		class={css({ fontSize: '2xl', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</h1>
{:else if variant === 'h2'}
	<h2
		class={css({ fontSize: 'xl', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</h2>
{:else if variant === 'h3'}
	<h2
		class={css({ fontSize: 'lg', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</h2>
{:else if variant === 'h4'}
	<h4
		class={css({ fontSize: 'md', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</h4>
{:else if variant === 'h5'}
	<h5
		class={css({ fontSize: '2xl', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</h5>
{:else if variant === 'h6'}
	<h6
		class={css({ fontSize: 'md', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</h6>
{:else if variant === 'subtitle'}
	<p
		class={css({ fontSize: 'md', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</p>
{:else if variant === 'body'}
	<p
		class={css({ fontSize: 'md', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</p>
{:else}
	<p
		class={css({ fontSize: 'md', ...styles })}
		id={_id}
		style={_id ? `view-transition-name: ${_id};` : ''}
		{...$$restProps}
	>
		<slot />
	</p>
{/if}
