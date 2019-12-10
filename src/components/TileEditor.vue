<template>
	<div class="col">
		<h2>Editing Tile {{coords()}}</h2>
		<input type="checkbox" name="Terminal" v-model="tile.terminal">
		<label for="Terminal">Terminal</label>

		<input type="checkbox" name="Accesible" v-model="tile.accessible">
		<label for="Accessible">Accessible</label>
	</div>
</template>

<script>
export default {
	name: "TileEditor",
	props: ["tile"],

	methods: {
		coords() {
			return '' + (this.tile.y+1) + '-' + (this.tile.x+1);
		}
	}
}
</script>