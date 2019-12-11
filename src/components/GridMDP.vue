<template>
	<div v-if="mdp" class="myRow">
		<GridMDPSettings id="settings" @apply-settings="applySettings()"/>
		
		<div id="display">
			<div v-bind:key="x" v-for="(col, x) in mdp.tiles" class="myRow">
				<div v-bind:key="y" v-for="(tile, y) in col" class="myCol">
					<GridMDPTile :ref="'' + x + '-' + y" :initTile="tile" @edit-tile="setEdit" class="tile"/>
				</div>
			</div>
			
			<v-btn @click="prevIter()">previous</v-btn>
			<v-btn @click="reset()">reset</v-btn>
			<v-btn @click="nextIter()">next</v-btn>
		</div>

		<TileEditor id="editor" v-if="editTile" v-bind:tile="editTile" ref="editor" @redraw="redraw"/>	
	</div>
</template>

<script>
import GridMDPTile from './GridMDPTile.vue';
import TileEditor from './TileEditor.vue';
import GridMDPSettings from './GridMDPSettings.vue';

import store from '../logic/settings.js'
import {gmdp} from '../logic/mdp_prop.js';

export default {
	name: "GridMDP",
	components : {GridMDPTile, TileEditor, GridMDPSettings},
	data() {return {
		mdp: null,
		editTile: null
	}},

	methods: {
		nextIter() {
			store.commit('nextIteration');

			if (store.state.displayIteration > this.mdp.iterations)
				this.mdp.iteration();
			
			this.redraw();
		},

		prevIter() {
			store.commit('prevIteration');
			this.redraw();
		},

		redraw() {
			for(let ref in this.$refs)
				if (this.isTileRef(ref))
					this.$refs[ref][0].redraw();
		},

		reset() {
			store.commit('resetIteration');
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
				], [0.8, 0.1, 0.1, 0], store.state.settings.discount, store.state.settings.stepCost);
			}
		},

		setEdit(tileID) {
			for (let ref in this.$refs) {
				if (this.isTileRef(ref)) {
					this.$refs[ref][0].editing = ref === tileID;
				}
			}

			let indexes = tileID.split("-");
			this.mdp.tiles[parseInt(indexes[0])][parseInt(indexes[1])];
			this.editTile = this.mdp.tiles[parseInt(indexes[0])][parseInt(indexes[1])];
		},

		isTileRef(ref) {
			return ref !== "editor" && ref !== "settings";
		},

		applySettings() {
			this.mdp.apply(store.state.settings);
		}
	},

	mounted() {
		this.reset();
		this.setEdit("0-0");
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

	#settings {
		display: inline-block;
		max-width: 25%;
	}

	#display {
		display: inline-block;
	}

	#editor {
		display: inline-block;
		max-width: 25%;
	}
</style>