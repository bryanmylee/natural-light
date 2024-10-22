<script lang="ts">
	import '../app.css';
</script>

<svelte:head>
	<title>Natural Light</title>
	<meta name="description" content="Beautiful screen lighting for your next video call" />
	<script>
		// configure color from cache before first render
		(function () {
			try {
				let theme = localStorage.getItem('temperature_theme');
				if (!theme) return;
				theme = JSON.parse(theme);
				document.documentElement.style.backgroundColor = theme?.paper;
				document.documentElement.style.setProperty('--temp-paper', theme?.paper);
				document.documentElement.style.setProperty('--temp-ink', theme?.ink);
				document.documentElement.style.setProperty('--temp-ink-black', theme?.inkBlack);
				document.documentElement.style.setProperty('--temp-ink-dark', theme?.inkDark);
				document.documentElement.style.setProperty('--temp-highlight', theme?.highlight);
			} catch (e) {}
		})();
	</script>
</svelte:head>

<slot />
