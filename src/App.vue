<template>
	<v-app>
		<v-content>
			<GridMDP />
		</v-content>
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
	}

	.myRow {
		display: flex;
		flex-flow: row nowrap;
	}
</style>
