<script>
	import '../app.css';
	import Header from '@components/Header.svelte';
	import Footer from '@components/Footer.svelte';
</script>

<div class="h-screen flex flex-col">
	<Header />
	<div
		class="flex-1 h-full flex flex-col overflow-x-hidden overflow-y-auto"
		style:perspective="8px"
		style:perspective-origin="center"
	>
		<div class="flex-1 flex flex-col" style:transform-style="preserve-3d">
			<slot />
		</div>
		<Footer />
	</div>
</div>
