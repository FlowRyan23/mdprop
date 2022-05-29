<template>
	<div>
		<v-navigation-drawer v-if="store.state.focus==='mdp'" id="nav-drawer" v-model="drawer" app clipped floating mobile-breakpoint="1200">
			<Settings :ref="'settings'" @apply-settings="applySettings()" @redraw="redraw()"/>
		</v-navigation-drawer>

		<v-app-bar app clipped-left>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer" />
			<v-toolbar-title>{{$t('toolbar.title')}}</v-toolbar-title>

			<v-spacer></v-spacer>
			
			<!-- Previous Iteration -->
			<v-tooltip bottom>
				<template v-slot:activator="{on, attrs}">
					<v-btn plain fab @click="prevIter()" v-on="on" v-bind="attrs">
						<v-icon>mdi-chevron-left</v-icon>
					</v-btn>
				</template>
				<span>{{$t('toolbar.tip.prevIter')}}</span>
			</v-tooltip>

			<!-- Display iteration -->
			<v-tooltip bottom>
				<template v-slot:activator="{on, attrs}">
					<v-text-field
						v-model="store.state.displayIteration"
						class="mt-0 pt-0 centered-text shrink"
						readonly
						flat
						solo
						hide-details
						single-line
						type="number"
						v-on="on"
						v-bind="attrs"
						@wheel.prevent="iterScrollHandler"
					></v-text-field>
				</template>
				<span>{{$t('toolbar.tip.iter')}}</span>
			</v-tooltip>

			<!-- Next Iteration -->
			<v-tooltip bottom>
				<template v-slot:activator="{on, attrs}">
					<v-btn plain fab @click="nextIter()" v-on="on" v-bind="attrs">
						<v-icon>mdi-chevron-right</v-icon>
					</v-btn>
				</template>
				<span>{{$t('toolbar.tip.nextIter')}}</span>
			</v-tooltip>

			<!-- Reset displayIteration -->
			<v-tooltip bottom>
				<template v-slot:activator="{on, attrs}">
					<v-btn plain fab @click="reset()" style="margin-right: 32px" v-on="on" v-bind="attrs">
						<v-icon>mdi-reload</v-icon>
					</v-btn>
				</template>
				<span>{{$t('toolbar.tip.reset')}}</span>
			</v-tooltip>

			<!-- Display reached Tiles -->
			<v-tooltip bottom>
				<template v-slot:activator="{on}">
					<v-btn-toggle value="true" :ref="'reachedToggle'" rounded color="blue">
						<v-btn value="true" @click="toggleReached()" v-on="on">
							{{$t('toolbar.reached')}}
						</v-btn>
					</v-btn-toggle>
				</template>
				<span>{{$t('toolbar.tip.reached')}}</span>
			</v-tooltip>

			<!-- Render Mode -->
			<v-tooltip bottom>
				<template v-slot:activator="{on, attrs}">
					<v-btn-toggle mandatory v-model="displayMode" @change="changeRender" style="margin-left: 16px">
						<v-btn text value="values" v-on="on" v-bind="attrs" @click="if(isSmall) showMessage($t('toolbar.message.modeDisabled'), 'error')">
							{{$t('toolbar.modeValues')}}
						</v-btn>
						<v-btn text value="policy" v-on="on" v-bind="attrs">
							{{$t('toolbar.modePolicy')}}
						</v-btn>
						<v-btn text value="detail" v-on="on" v-bind="attrs" @click="if(isSmall) showMessage($t('toolbar.message.modeDisabled'), 'error')">
							{{$t('toolbar.modeDetail')}}
						</v-btn>
					</v-btn-toggle>
				</template>
				<span>{{$t('toolbar.tip.renderMode')}}</span>
			</v-tooltip>

			<v-spacer></v-spacer>


			<v-toolbar-items>
				<!-- open Saver -->
				<v-tooltip bottom>
					<template v-slot:activator="{on, attrs}">
						<v-btn plain fab @click="store.commit('displaySaver')" v-on="on" v-bind="attrs">
							<v-icon>mdi-content-save</v-icon>
						</v-btn>
					</template>
					<span>{{$t('toolbar.tip.save')}}</span>
				</v-tooltip>

				<!-- open level -->
				<v-tooltip bottom>
					<template v-slot:activator="{on, attrs}">
						<v-btn plain fab @click="store.commit('displaySelector')" v-on="on" v-bind="attrs">
							<v-icon>mdi-folder-open-outline</v-icon>
						</v-btn>
					</template>
					<span>{{$t('toolbar.tip.open')}}</span>
				</v-tooltip>

				<!-- open creator -->
				<v-tooltip bottom>
					<template v-slot:activator="{on, attrs}">
						<v-btn plain fab @click="store.commit('displayCreator')" v-on="on" v-bind="attrs">
							{{$t('toolbar.new')}}
						</v-btn>
					</template>
					<span>{{$t('toolbar.tip.new')}}</span>
				</v-tooltip>

				<!-- open solution view -->
				<v-tooltip bottom>
					<template v-slot:activator="{on, attrs}">
						<v-btn plain fab @click="store.commit('displaySolution')" v-on="on" v-bind="attrs">
							<v-icon>mdi-page-next-outline</v-icon>
						</v-btn>
					</template>
					<span>{{$t('toolbar.tip.solution')}}</span>
				</v-tooltip>
			</v-toolbar-items>

			<v-spacer></v-spacer>
		</v-app-bar>

		<v-main id="main">
			<div v-if="store.state.focus==='mdp'" class="d-flex" style="justify-content: space-between">
				<div></div>

				<div v-if="mdp" class="d-flex" style="justify-content: center">
					<div>
						<Display :ID="'primary'" :ref="'display'" :mdp="mdp" :mode="displayMode" @interaction="setEdit"/>
					</div>
				</div>

				<div>
				<TileEditor id="editor" v-if="editTile" :tile="editTile" ref="editor" @redraw="redraw" @close="closeEditor"/>
				<div v-else></div>

				</div>

			</div>

			<div v-else-if="store.state.focus==='creator'" id="creator">
				<Creator @created="setMDP"/>
			</div>

			<div v-else-if="store.state.focus==='solution'" id="solution">
				<Solution :mdp="mdp"/>
			</div>

			<div v-else-if="store.state.focus==='selector'">
				<LevelSelector @selected="setMDP"/>
			</div>

			<div v-else-if="store.state.focus==='saver'">
				<SaveDialogue :mdp="mdp" />
			</div>

			<div v-if="dev">
				<v-btn @click="plot()">plot</v-btn>
				<div id="plotDiv" ref="plt"></div>

				<v-btn @click="eval()">eval</v-btn>

			</div>

		</v-main>

		<v-snackbar
			v-model="message"
			:timeout="msgTimeout"
			:color="msgColor">
			{{msgText}}
			<template v-slot:action="{attrs}">
				<v-btn v-bind="attrs" text @click.native="message = false">
					{{$t('toolbar.message.close')}}
				</v-btn>
			</template>
		</v-snackbar>

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
import LevelSelector from "./LevelSelector.vue";
import SaveDialogue from "./SaveDialogue.vue";

import store from "../logic/sharedData";
import GridMDP from '../logic/mdp_prop';
import plotCurrent from "../logic/analytics/plotEntry";
import evaluate from "../logic/analytics/evaluation";

export default {
	name: 'GridMDP',
	components: {Display, Settings, Solution, Creator, TileEditor, LevelSelector, SaveDialogue},
	props: {source: String},

	data() {return {
		store: store,
		drawer: false,
		mdp: null,
		editTile: null,
		displayMode: "values",
		reached: store.state.reachedPreview,
		dev: true,

		// message dialogues
		message: false,
		msgText: "",
		msgColor: "",
		msgTimeout: 2000
	}},

	methods: {
		plot() {
			plotCurrent(this.$refs["plt"], this.mdp.compact());
		},

		eval() {
			evaluate();
		},

		nextIter() {
			store.commit('nextIteration');

			while (store.state.displayIteration > this.mdp.iteration)
				this.mdp.next();
			
			this.redraw();
		},

		prevIter() {
			store.commit('prevIteration');
			this.redraw();
		},

		reset() {
			store.commit('resetIteration');

			if (this.mdp !== null) {
				this.mdp.reset();
				this.redraw();
			} else {
				this.mdp = new GridMDP(store.state.worlds.default.level, store.state.worlds.default.discount, store.state.worlds.default.stepCost);
			}
		},

		setEdit(tilePos) {
			if (!this.editTile) {
				this.test = "hey";
				window.addEventListener("keydown", this.selectionListener);
			}

			this.editTile = this.mdp.tiles[tilePos.x][tilePos.y];
		},

		applySettings() {
			this.mdp.apply(this.mdpSettings);
			this.redraw();
		},

		toggleReached() {
			if ((this.$refs.reachedToggle.selectedItems.length===0) != store.state.reachedPreview) {
				store.commit('toggleReachedPreview');
				this.redraw();
			}
		},

		changeRender() {
			store.commit('setRender', this.displayMode);
			this.redraw();
		},
		
		setMDP(mdp) {
			// clear previous state
			this.mdp = null;
			this.editTile = null;
			store.commit('resetIteration');

			// generate new mdp
			this.mdp = mdp;
			this.mdp.apply(this.mdpSettings);
			mdp.reset();
			store.commit('displayMDP');
			this.fitCanvas();
		},

		fitCanvas() {
			// normalizing zoom to fit the new level and utilize available space
			let zoom = 100;
			if(this.mdp.tiles.length * 100 > 0.80 * window.innerHeight) {
				zoom = (0.9 * window.innerHeight) / this.mdp.tiles.length;
			}
			if(this.mdp.tiles[0].length * zoom > 0.7 * window.innerWidth) {
				zoom = (0.7 * window.innerWidth) / this.mdp.tiles[0].length;
			}
			store.commit('setTileSizes', {width: zoom, height: zoom});
		},

		closeEditor() {
			window.removeEventListener("keydown", this.selectionListener);
			this.editTile = null;
			this.$refs['display'].clearSelected();
			this.redraw();
		},

		showMessage(text, color, timeout=4000) {
			this.msgText = text;
			this.msgColor = color;
			this.msgTimeout = timeout;
			this.message = true;
		},
		
		redraw() {
			// when zoom is set by the creator, settings initiates rendering before display is ready
			if(this.$refs['display'])
				this.$refs['display'].render();
		},

		iterScrollHandler(event) {
			if(event.deltaY > 0) {
				this.prevIter();
			} else {
				this.nextIter();
			}
		},

		selectionListener(event) {
			if (store.state.focus !== "mdp") {
				return;
			}

			let display = this.$refs.display;
			this.test = display;
			switch (event.key) {
				case "ArrowUp":
					if (display.selectedX > 0) {
						display.selectedX--;
					}
					break;
				case "ArrowDown":
					if (display.selectedX < this.mdp.tiles.length - 1) {
						display.selectedX++;
					}
					break;
				case "ArrowLeft":
					if (display.selectedY > 0) {
						display.selectedY--;
					}
					break;
				case "ArrowRight":
					if (display.selectedY < this.mdp.tiles[0].length -1) {
						display.selectedY++;
					}
					break;
				case "Escape":
					this.closeEditor();
					return;
				default:
					return;
			}

			this.setEdit({x:display.selectedX, y:display.selectedY});
			this.redraw();
		}
	},

	computed: {
		displayIteration() {
			return store.state.displayIteration;
		},

		mdpSettings() {return  {
			discount: store.state.discount,
			stepCost: store.state.stepCost,
			scFront: store.state.scFront,
			scBack: store.state.scBack,
			scLeft: store.state.scLeft,
			scRight: store.state.scRight
		}},

		isSmall() {
			return store.state.tileHeight <= 25 || store.state.tileWidth <= 30;
		}
	},

	mounted() {
		this.reset();
	}
}
</script>

<style scoped>
	#main {
		/* overflow-x: scroll;
		overflow-y: visible; */
		height: 100vh - 100px;
		/* background-color: #121212; */
	}

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