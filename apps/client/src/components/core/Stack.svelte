<script lang="ts">
	import { stack, type StackStyles } from 'styled-system/patterns';
	export let styles: StackStyles = {};
</script>

<div class={stack({ ...styles })} {...$$restProps}>
	<slot />
</div>
