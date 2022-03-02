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

	.no-spins input[type='number'] {
    -moz-appearance:textfield;
	}

	::v-deep input::-webkit-outer-spin-button,
	::v-deep input::-webkit-inner-spin-button {
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
	}

	.no-pad {
		padding: 0px;
	}
</style>
