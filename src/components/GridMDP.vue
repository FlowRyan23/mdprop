<template>
	<div>
		<div v-if="mdp" id="content" class="myRow">
			<div>
				<div v-bind:key="x" v-for="(col, x) in mdp.tiles" class="d-flex">
					<div v-bind:key="y" v-for="(tile, y) in col" class="d-flex flex-column">
						<GridMDPTile :ref="'' + x + '-' + y" :tile="tile" @edit-tile="setEdit" class="tile"/>
					</div>
				</div>
				
				<div id="level-buttons">
					<div>
						<v-btn @click="prevIter()">prev</v-btn>
						<v-btn @click="reset()">reset</v-btn>
						<v-btn @click="nextIter()">next</v-btn>
					</div>
					<div>
						<v-btn @click="save()">save</v-btn>
						<v-btn @click="kill()">new</v-btn>
					</div>
				</div>
			</div>
			
			<TileEditor id="editor" v-if="editTile" :tile="editTile" ref="editor" @redraw="redraw"/>
		</div>

		<div v-else id="creator">
			<creator/>
		</div>
	</div>
</template>

<script>
import GridMDPTile from './GridMDPTile';
import TileEditor from './TileEditor';
import Creator from './Creator';

import store from '../logic/sharedData';
import GridMDP from '../logic/mdp_prop';
import create from '../logic/levelGeneration';

export default {
	name: "GridMDP",
	components : {Creator, GridMDPTile, TileEditor},
	data() {return {
		mdp: null,
		editTile: null,

		// temporary
		checkRes: null,
		reqs: null
	}},

	methods: {
		nextIter() {
			store.commit('nextIteration');

			if (store.state.displayIteration > this.mdp.iteration)
				this.mdp.next();
			
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
				this.mdp = new GridMDP(store.state.level, store.state.settings.stepChances,
								store.state.settings.discount, store.state.settings.stepCost);
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
			return this.$refs[ref] && this.$refs[ref][0] && ref !== "editor" && ref !== "settings";
		},

		applySettings() {
			this.mdp.apply(store.state.settings);
			this.redraw();
		},

		kill() {
			this.mdp = null;
		},

		create(requirements) {
			this.reqs = requirements;
			this.mdp = create(requirements);
			this.checkRes = requirements.check(this.mdp, true);
			store.commit('setLevel', this.mdp.compact());
			//this.setEdit("0-0");
			this.editTile = null;
		}
	},

	computed: {
		creating() {
			return this.mdp;
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
		min-width: 20%;
		max-width: 25%;
	}

	#display {
		display: inline-block;
		flex-grow: 1;
	}

	#level-buttons {
		display: flex;
		justify-content: space-between;
	}

	#editor {
		display: inline-block;
		min-width: 20%;
		max-width: 35%;
		flex-grow: 0;
	}
</style>