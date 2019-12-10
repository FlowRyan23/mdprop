<template>
	<div>
		<div v-if="mdp">
			<div v-bind:key="x" v-for="(col, x) in mdp.tiles" class="row">
				<div v-bind:key="y" v-for="(tile, y) in col" class="col">
					<GridMDPTile :ref="'' + x + '-' + y" v-bind:initTile="tile" @edit-tile="setEdit" class="tile"/>
				</div>
			</div>
			<TileEditor v-if="editID" ref="editor"/>
		</div>
		<button v-on:click="iter()">next</button>
		<button v-on:click="generate()">go</button>
	</div>
</template>

<script>
import GridMDPTile from './GridMDPTile.vue';
import TileEditor from './TileEditor.vue'
import {gmdp} from '../logic/mdp_prop.js';

export default {
	name: "GridMDP",
	components : {GridMDPTile, TileEditor},
	data() {return {
		mdp: null,
		editID: null
	}},
	methods: {
		iter() {
			this.mdp.iteration();
			this.redraw();
		},

		redraw() {
			for(let ref in this.$refs)
				this.$refs[ref][0].redraw();
		},

		generate() {
			if (this.mdp !== null) {
				this.mdp.reset();
				this.redraw();
			} else {
				this.mdp = gmdp([
					[0, 0, 0, 0, 0, 0, -1, 0],
					[0, null, null, 0, null, 1, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0],
					[0, null, null, 0, null, 0, 0, 0],
					[0, 0, null, 0, null, null, null, null],
					[null, 0, null, 0, 0, 0, 0, 0],
					[0, 0, null, 0, 0, null, 0, 1]
				]);
			}
		},

		setEdit(tileID) {
			this.editID = tileID;
			let indexes = this.editID.split("-");
			this.$refs["editor"].tile = this.mdp.tiles[parseInt(indexes[0])][parseInt(indexes[1])];
		}
	}
}
</script>

<style scoped>
	.col {
		display: flex;
		flex-direction: column
	}

	.row {
		display: flex;
		flex-direction: row
	}

	.tile {
		display: inline-block;
	}
</style>