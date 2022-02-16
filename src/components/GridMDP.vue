<template>
	<div>
		<v-navigation-drawer id="nav-drawer" v-model="drawer" app clipped floating mobile-breakpoint="1200">
			<Settings id="settings" @apply-settings="applySettings()"/>
		</v-navigation-drawer>

		<v-app-bar app clipped-left>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer" />
			<v-toolbar-title>MDP Q-Value-Propagation</v-toolbar-title>

			<v-spacer></v-spacer>
			
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

			<v-btn-toggle rounded color="blue">
				<v-btn @click="toggleReached()">
					<!-- <v-icon>mdi-alpha-r</v-icon> -->
					Reached
				</v-btn>
			</v-btn-toggle>

			<v-select
				id="display-mode-selector"
				v-model="displayMode"
				:items="displayModes"
				label="Display Mode"
				@change="redraw()"
				style="margin-top: 24px; margin-left: 32px; max-width: 200px"
				solo dense>
			</v-select>

			<v-spacer></v-spacer>

			<v-toolbar-items>
					<v-btn plain fab @click="save()"><v-icon>mdi-content-save</v-icon></v-btn>
					<v-btn plain fab @click="displayCreator()">
						<!-- <v-icon>mdi-new-box</v-icon> -->
						New
					</v-btn>
					<v-btn plain fab @click="openDownloader()"><v-icon>mdi-page-next-outline</v-icon></v-btn>
			</v-toolbar-items>

			<v-spacer></v-spacer>
		</v-app-bar>

		<v-main>
			<div class="d-flex" style="justify-content: space-between">
				<div></div>

				<div v-if="mdp && store.state.displayMode===1" class="d-flex" style="justify-content: center">
					<div>
						<Display :ID="'primary'" :ref="'display'" :tiles="mdp.tiles" :mode="displayMode" @interaction="setEdit"/>
					</div>
				</div>

				<TileEditor id="editor" v-if="editTile" :tile="editTile" ref="editor" @redraw="redraw" @close="closeEditor"/>
				<div v-else></div>

			</div>

			<div v-if="plotting" id="plotDiv" ref="plt"></div>
			<v-btn @click="plot()">plot</v-btn>
			
			<div v-if="store.state.displayMode===2" id="creator">
				<Creator @create="create"/>
			</div>

			<div v-else-if="store.state.displayMode===3" id="solution">
				<Solution :mdp="mdp"/>
			</div>
		</v-main>

		<v-footer app>
		</v-footer>
	</div>
</template>

<script>
import Settings from "./Settings.vue";
import Solution from "./Solution.vue";
import Creator from "./Creator.vue";
import Display from "./Display.vue";
import TileEditor from "./TileEditor.vue";

import store from "../logic/sharedData";
import GridMDP from '../logic/mdp_prop';
import create from '../logic/levelGeneration';
import {plotAvrgDistance} from "../logic/analytics/effective_distance"

export default {
	name: 'GridMDP',
	components: {Display, Settings, Solution, Creator, TileEditor},
	props: {source: String},

	data() {return {
		store: store,
		drawer: false,
		mdp: null,
		editTile: null,
		displayModes: ["values", "policy", "detail"],
		displayMode: "values",
		plotting: true
	}},

	methods: {
		plot() {
			plotAvrgDistance(this.$refs["plt"], this.mdp.compact());
		},

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

		applySettings() {
			this.mdp.apply(store.state.settings);
			this.redraw();
		},

		toggleReached() {
			store.commit('toggleReachedPreview');
			this.redraw();
		},
		
		create(requirements) {
			this.reqs = requirements;
			this.mdp = null;
			this.mdp = create(requirements);
			this.checkRes = requirements.check(this.mdp, true);
			store.commit('setLevel', this.mdp.compact());
			this.editTile = null;
			store.commit('displayMDP');
			if(this.mdp.tiles.length * store.state.settings.tileWidth > 0.8 * window.innerWidth) {
				store.commit('setZoom', (0.8 * window.innerWidth) / this.mdp.tiles.length);
			}
			if(this.mdp.tiles[0].length * store.state.settings.tileHeight > 0.8 * window.innerHeight) {
				store.commit('setZoom', (0.8 * window.innerHeight) / this.mdp.tiles[0].length);
			}
			this.redraw(); //TODO does not redraw the mdp
		},

		displayCreator() {
			store.commit('displayCreator');
		},

		closeEditor() {
			this.editTile = null;
			this.$refs['display'].clearSelected();
			this.redraw();
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
	#nav-drawer {
		min-width: 400px;
	}

	#display-mode-selector {
		margin-top: 16px;
		margin-left: 32px;
	}

	.centered-text >>> input {
		text-align: center;
	}

	#editor {
		display: inline-block;
		max-width: 600px;
		flex-grow: 0;
	}
</style>