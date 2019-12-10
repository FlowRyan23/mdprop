<template>
	<div>
		<div v-if="mdp" class="row" id="mdpView">
			<div>
				<div v-bind:key="x" v-for="(col, x) in mdp.tiles" class="row">
					<div v-bind:key="y" v-for="(tile, y) in col" class="col">
						<GridMDPTile :ref="'' + x + '-' + y" :initTile="tile" @edit-tile="setEdit" class="tile"/>
					</div>
				</div>
			</div>
			<TileEditor v-if="editTile" v-bind:tile="editTile" ref="editor" id="editor"/>
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
		editTile: null
	}},
	methods: {
		iter() {
			this.mdp.iteration();
			this.redraw();
		},

		redraw() {
			for(let ref in this.$refs)
				if (ref !== "editor")
					this.$refs[ref][0].redraw();
		},

		generate() {
			if (this.mdp !== null) {
				this.mdp.reset();
				this.redraw();
			} else {
				this.mdp = gmdp([
					[0, 0, 0, 0, 0, 0, -1, 0],
					[0, null, null, 0, null, 1, 0, -1],
					[0, 0, 0, 0, 0, 0, 0, 0],
					[0, null, null, 0, null, 0, 0, 0],
					[0, 0, null, 0, null, null, null, null],
					[null, 0, null, 0, 0, 0, 0, 0],
					[0, 0, null, 0, 0, null, 0, 1]
				]);
			}
		},

		setEdit(tileID) {
			let indexes = tileID.split("-");
			this.mdp.tiles[parseInt(indexes[0])][parseInt(indexes[1])];
			this.editTile = this.mdp.tiles[parseInt(indexes[0])][parseInt(indexes[1])];
		}
	}
}
</script>

<style scoped>
	.tile {
		display: inline-block;
	}

	.selected {
		border: 1px solid goldenrod;
	}

	#mdpView {
		flex-flow: row nowrap
	}
</style>