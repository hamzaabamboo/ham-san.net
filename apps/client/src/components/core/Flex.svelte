<script lang="ts">
	import { flex, type FlexStyles } from 'styled-system/patterns';
	export let styles: FlexStyles = {};
</script>

<div class={flex({ ...styles })} {...$$restProps}>
	<slot />
</div>
