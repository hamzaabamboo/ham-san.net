<script lang="ts">
	import { wrap, type WrapStyles } from 'styled-system/patterns';
	export let styles: WrapStyles;
</script>

<div class={wrap({ ...styles })} {...$$restProps}>
	<slot />
</div>
