<script lang="ts">
	import { hstack, type HstackStyles } from 'styled-system/patterns';
	export let styles: HstackStyles = {};
</script>

<div class={hstack({ ...styles })} {...$$restProps}>
	<slot />
</div>
