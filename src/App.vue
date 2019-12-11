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
		justify-content: space-around;
	}

	.myRow {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-around;
	}
</style>
