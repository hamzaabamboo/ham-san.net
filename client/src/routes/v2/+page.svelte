<script lang="ts">
	import { browser } from '$app/environment';
	import A from 'ammojs3';
	import { onDestroy, onMount } from 'svelte';
	import { danceScene } from '../../3d/danceScene';
	const { init, animate, onWindowResize } = danceScene();

	onMount(() => {
		if (browser) {
			A.bind(window)().then((Ammo) => {
				init();
				animate();
				window?.addEventListener('resize', onWindowResize);
			});
		}
	});

	onDestroy(() => {
		if (browser) {
			window?.removeEventListener('resize', onWindowResize);
		}
	});
</script>

<div id="container" class="flex-1"></div>
<!-- <div id="blocker" class="absolute top-0 left-0 bottom-0 right-0"></div> -->
