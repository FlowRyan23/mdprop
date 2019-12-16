<template>
	<div>
		<v-navigation-drawer id="settings" app persistent floating disable-resize-watcher mobile-break-point="0" width="20%">
			<GridMDPSettings @apply-settings="applySettings()"/>
		</v-navigation-drawer>

		<div v-if="mdp" id="content" class="myRow">
			<div>
				<div v-bind:key="x" v-for="(col, x) in mdp.tiles" class="myRow">
					<div v-bind:key="y" v-for="(tile, y) in col" class="myCol">
						<GridMDPTile :ref="'' + x + '-' + y" :initTile="tile" @edit-tile="setEdit" class="tile"/>
					</div>
				</div>
				
				<v-btn @click="prevIter()">previous</v-btn>
				<v-btn @click="save()">save</v-btn>
				<v-btn @click="reset()">reset</v-btn>
				<v-btn @click="nextIter()">next</v-btn>
				<v-btn @click="kill()">new</v-btn>
			</div>
			
			<TileEditor id="editor" v-if="editTile" :tile="editTile" ref="editor" @redraw="redraw"/>
		</div>

		<div v-else id="creator">
			<v-text-field
				label="Width"
				v-model="width"
				min="1"
				:max="maxWidth"
				class="mt-0 pt-0"
				hide-details
				single-line
				type="number"
				style="width: 60px"
			></v-text-field>

			<v-text-field
				label="Height"
				v-model="height"
				min="1"
				class="mt-0 pt-0"
				hide-details
				single-line
				type="number"
				style="width: 60px"
			></v-text-field>
			<v-btn @click="create()">create</v-btn>
		</div>
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
		editTile: null,
		width: 10,
		height: 7
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
				this.mdp = gmdp(store.state.level, [0.8, 0.1, 0.1, 0]
				, store.state.settings.discount, store.state.settings.stepCost);
			}
		},

		save() {
			store.commit('setLevel', this.mdp.compact());
		},

		setEdit(tileID) {
			for (let ref in this.$refs) {
				if (this.isTileRef(ref)) {
					this.$refs[ref][0].editing = ref === tileID;
				}
			}

			let indexes = tileID.split("-");
			this.editTile = this.mdp.tiles[parseInt(indexes[0])][parseInt(indexes[1])];
		},

		isTileRef(ref) {
			return ref !== "editor" && ref !== "settings";
		},

		applySettings() {
			this.mdp.apply(store.state.settings);
		},

		kill() {
			this.mdp = null;
		},

		create() {
			this.width = Math.max(1, Math.min(store.state.settings.maxWidth, this.width));
			this.height = Math.max(1, Math.min(store.state.settings.maxHeight, this.height));

			let level = [];
			for(let x=0; x<this.height; x++) {
				level[x] = [];
				for(let y=0; y<this.width; y++) {
					level[x][y] = 0;
				}
			}
			this.mdp = gmdp(level);
			this.setEdit("0-0");
		}
	},

	computed: {
		maxWidth() {
			return store.state.settings.maxWidth;
		}
	},

	created() {
		store.commit('setSettings', {...store.state.defaultSettings});
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