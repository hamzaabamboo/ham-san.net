<script lang="ts">
	import { container, type ContainerStyles } from 'styled-system/patterns';
	export let styles: ContainerStyles = {};
</script>

<div class={container({ ...styles })} style:transform-style="preserve-3d" {...$$restProps}>
	<slot />
</div>
