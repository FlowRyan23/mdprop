<template>
	<v-app>
		<Baseline />
	</v-app>
</template>

<script>
import Baseline from "./components/Baseline.vue";

export default {
	name: "App",

	components: {
		Baseline
	}
};
</script>

<style>
	.myCol {
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-evenly;
	}

	.myRow {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-evenly;
	}

	.no-pad {
		padding: 0px;
	}
</style>
