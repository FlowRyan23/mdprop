<template>
	<div>
		<div v-if="store.state.displayMode===1" id="content" class="d-flex">
			<div></div>

			<div v-if="mdp" class="d-flex flex-column">
				<div>
					<v-toolbar>
						<!-- Display iteration -->
						<v-btn plain fab @click="prevIter()"><v-icon>mdi-chevron-left</v-icon></v-btn>
						<v-text-field
							v-model="displayIteration"
							class="mt-0 pt-0 centered-text shrink"
							readonly
							flat
							solo
							hide-details
							single-line
							type="number"
						></v-text-field>
						<v-btn plain fab @click="nextIter()"><v-icon>mdi-chevron-right</v-icon></v-btn>

						<v-btn plain fab @click="reset()" style="margin-right: 32px"><v-icon>mdi-reload</v-icon></v-btn>
						<v-btn plain fab @click="toggleReached()">
							<v-icon>mdi-alpha-r-box-outline</v-icon>
						</v-btn>

						<v-spacer></v-spacer>

						<v-toolbar-items>
								<v-btn plain fab @click="save()"><v-icon>mdi-content-save</v-icon></v-btn>
								<v-btn plain fab @click="kill()"><v-icon>mdi-new-box</v-icon></v-btn>
								<v-btn plain fab @click="openDownloader()"><v-icon>mdi-page-next-outline</v-icon></v-btn>
						</v-toolbar-items>
					</v-toolbar>
				</div>

				<div class="d-flex" style="justify-content: center">
					<GridMDPDisplay v-if="mdp" :ID="'primary'" :ref="'display'" :tiles="mdp.tiles" @interaction="setEdit"/>
				</div>
		
			<!-- <div v-bind:key="x" v-for="(col, x) in mdp.tiles" class="d-flex">
				<div v-bind:key="y" v-for="(tile, y) in col" class="d-flex flex-column">
					<GridMDPTile :ref="'' + x + '-' + y" :tile="tile" @edit-tile="setEdit" class="tile"/>
				</div>
			</div> -->				
			</div>
			
			<TileEditor id="editor" v-if="editTile" :tile="editTile" ref="editor" @redraw="redraw" @close="closeEditor"/>
			<div v-else></div>
		</div>

		<div v-else-if="store.state.displayMode===2" id="creator">
			<creator/>
		</div>

		<div v-else-if="store.state.displayMode===3" id="solution">
			<Solution :mdp="mdp"/>
		</div>

	</div>
</template>

<script>
import TileEditor from './TileEditor';
import Creator from './Creator';
import Solution from './Solution'

import store from '../logic/sharedData';
import GridMDP from '../logic/mdp_prop';
import create from '../logic/levelGeneration';
import GridMDPDisplay from './GridMDPDisplay.vue';

export default {
	name: "GridMDP",
	components : {Creator, TileEditor, Solution, GridMDPDisplay},
	data() {return {
		store: store,
		mdp: null,
		editTile: null,
		hover: false,

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
			this.$refs['display'].render();
		},

		closeEditor() {
			this.editTile = null;
			this.$refs['display'].clearSelected();
			this.redraw();
		},

		reset() {
			store.commit('resetIteration');

			if (this.mdp !== null) {
				this.mdp.reset();
				this.redraw();
			} else {
				this.mdp = new GridMDP(store.state.level, store.state.settings.discount, store.state.settings.stepCost);
			}
		},

		save() {
			store.commit('setLevel', this.mdp.compact());
		},

		setEdit(tileID) {
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

		toggleReached() {
			store.commit('toggleReachedPreview');
			this.redraw();
		},

		kill() {
			this.mdp = null;
			store.commit('displayCreator');
		},

		create(requirements) {
			// TODO levels with 1400 Tiles or more exceed the maximum call stack size
			this.reqs = requirements;
			this.mdp = create(requirements);
			this.checkRes = requirements.check(this.mdp, true);
			store.commit('setLevel', this.mdp.compact());
			//this.setEdit("0-0");
			this.editTile = null;
			store.commit('displayMDP');
		},

		openDownloader() {
			store.commit('displayDownloader');
		}
	},

	computed: {
		displayIteration() {
			return store.state.displayIteration;
		}
	},

	created() {
		store.commit('setSettings', {...store.state.defaultSettings});
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

	.centered-text >>> input {
		text-align: center;
	}

	#content {
		justify-content: space-between;
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

	#editor {
		display: inline-block;
		min-width: 20%;
		max-width: 35%;
		flex-grow: 0;
	}
</style>