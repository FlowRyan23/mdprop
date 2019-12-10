<template>
	<div class="col" @click="$emit('redraw')">
		<h2>Editing Tile {{coords()}}</h2>
		<v-checkbox v-model="tile.terminal" :label="'Terminal'"></v-checkbox>
		<v-checkbox v-model="tile.accessible" :label="'Accesible'"></v-checkbox>
	</div>
</template>

<script>
export default {
	name: "TileEditor",
	props: ["tile"],
	data() {return {
		test: false
	}},

	methods: {
		coords() {
			return '' + (this.tile.y+1) + '-' + (this.tile.x+1);
		}
	}
}
</script>