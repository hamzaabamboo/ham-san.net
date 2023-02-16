<script>
	import '../app.css';
	import Header from '@components/Header.svelte';
	import Footer from '@components/Footer.svelte';
</script>

<div class="min-h-screen flex flex-col">
	<Header />
	<div class="flex-1 h-full flex flex-col overflow-hidden">
		<slot />
	</div>
	<Footer />
</div>
