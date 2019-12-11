<template>
	<div>
		<div v-if="mdp" class="myRow" id="mdpView">
			<div>
				<div v-bind:key="x" v-for="(col, x) in mdp.tiles" class="myRow">
					<div v-bind:key="y" v-for="(tile, y) in col" class="myCol">
						<GridMDPTile :ref="'' + x + '-' + y" :initTile="tile" @edit-tile="setEdit" class="tile"/>
					</div>
				</div>
			</div>
			<TileEditor v-if="editTile" v-bind:tile="editTile" ref="editor" id="editor" @redraw="redraw"/>
		</div>
		<v-btn v-on:click="reset()">reset</v-btn>
		<v-btn v-on:click="iter()">next</v-btn>
		<GridMDPSettings :settings="settings" @reset-setting="resetSetting"/>
	</div>
</template>

<script>
import GridMDPTile from './GridMDPTile.vue';
import TileEditor from './TileEditor.vue';
import GridMDPSettings from './GridMDPSettings.vue'
import {gmdp} from '../logic/mdp_prop.js';

export default {
	name: "GridMDP",
	components : {GridMDPTile, TileEditor, GridMDPSettings},
	data() {return {
		mdp: null,
		editTile: null,
		defaultSettings: {
			defaultStepCost: 0,
			defaultDiscount: 0.9
		},
		settings: null
	}},
	methods: {
		iter() {
			this.mdp.iteration();
			this.redraw();
		},

		redraw() {
			for(let ref in this.$refs)
				if (this.isTileRef(ref))
					this.$refs[ref][0].redraw();
		},

		reset() {
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
				], [0.8, 0.1, 0.1, 0], this.settings.defaultDiscount, this.settings.defaultStepCost);
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

		resetSetting(key) {
			if (key) this.settings[key] = this.defaultSettings[key];
			else this.settings = {...this.defaultSettings};
		}
	},

	created() {
		this.settings = {...this.defaultSettings};
	},

	mounted() {
		this.reset();
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