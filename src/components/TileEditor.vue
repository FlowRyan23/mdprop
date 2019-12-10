<template>
	<div>
		<h2>Editing Tile {{initTile}}</h2>
		<input type="checkbox" name="Terminal" v-model="initTile.terminal">
	</div>
</template>

<script>
export default {
	name: "TileEditor",
	props: ["initTile"],
	date: {
		tile: null
	},

	mounted() {
		this.tile = this.initTile;
	}
}
</script>