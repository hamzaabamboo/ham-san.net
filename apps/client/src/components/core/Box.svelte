<script lang="ts">
	import { css } from 'styled-system/css';
	import type { SystemStyleObject } from 'styled-system/types';
	export let styles: SystemStyleObject = {};
</script>

<div class={css({ ...styles })} {...$$restProps}>
	<slot />
</div>
