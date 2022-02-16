<template>
	<v-app>
		<GridMDP />
	</v-app>
</template>

<script>
import GridMDP from "./components/GridMDP.vue";

export default {
	name: "App",

	components: {
		GridMDP
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
