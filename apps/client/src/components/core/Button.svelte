<script lang="ts">
	import { button, type ButtonVariantProps } from 'styled-system/recipes';
	export let styles: ButtonVariantProps;
</script>

<button class={button({ ...styles })} {...$$restProps}>
	<slot />
</button>
