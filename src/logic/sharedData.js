import Vue from 'vue';
import Vuex from 'vuex';
import worlds from '../assets/worlds.json'

Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		useRounded: true,		// round all values to two decimal places
		showTooltips: false,	// tooltips explaining most components
		
		discount: 0.9,			// discount applied to every action (overridden wehn individual discounts are givin)
		stepCost: 0,				// stepCost applied to every action (overridden wehn individual costs are givin)
		//stepChances
		scFront: 0.8,
		scLeft: 0.1,
		scRight: 0.1,
		scBack: 0,

		// display
		displayIteration: 0,
		tileWidth: 100,
		tileHeight: 100,
		
		focus: "mdp",		// "mdp": Standard GridMDP view; "creator": Level Creator Dialog; "solution": Solution Downloader; "selector": Open Level; "saver": Save Level Dialogue
		reachedPreview: true,
		renderMode: "values",
		tileColors: true,
		darkMode: true,

		genState: {
			width: 4,
			height: 3,
			goals: 1,
			traps: 1,
			generator: "perfect",
			constraints:  {
				connected : 'optional',
				deadEnds : 'optional',
				winnable : 'optional',
				partiallyWinnable : 'optional',
				survivable : 'optional',
				partiallySurvivable : 'optional',
				partiallyDangerous: 'optional',
				dangerous : 'optional',
				partiallyLost : 'optional',
				lost : 'optional',
				unambiguous : 'optional',
				trivial : 'optional'
			}
		},

		// dirty fixes
		lockShortcuts: false,
		
		// advanced settings
		enableActionEditing: false,

		worlds: worlds,

		// debugging and development data
		dev: false,
		savedPlotData: null
	},

	mutations: {
		setRender(state, mode) {
			state.renderMode = mode;
		},

		nextIteration(state) {
			state.displayIteration++;
		},

		prevIteration(state) {
			if (state.displayIteration > 0)
				state.displayIteration--;
		},

		resetIteration(state) {
			state.displayIteration = 0;
		},

		setDiscount(state, discount) {
			state.discount = discount;
		},

		setStepCost(state, stepCost) {
			state.stepCost = stepCost;
		},

		setTileSizes(state, size) {
			state.tileWidth = size.width;
			state.tileHeight = size.height;
		},

		setStepChances(state, chances) {
			state.scFront = chances.front;
			state.scBack = chances.back;
			state.scLeft = chances.left;
			state.scRight = chances.right;
		},

		setGeneratorState(state, genState) {
			state.genState = genState;
		},

		toggleTooltips(state) {
			state.showTooltips = !state.showTooltips;
		},

		toggleReachedPreview(state) {
			state.reachedPreview = !state.reachedPreview;
		},

		toggleRounded(state) {
			state.useRounded = !state.useRounded;
		},

		toggleTileColors(state) {
			state.tileColors = !state.tileColors;
		},

		toggleDarkMode(state) {
			state.darkMode = !state.darkMode;
		},

		toggleShortcuts(state) {
			state.lockShortcuts = !state.lockShortcuts;
		},

		saveLevel(state, world) {
			let baseName = world.name;
			let k = 0;
			while (state.worlds[world.name]) {
				k++;
				world.name = baseName + "(" + k + ")";
			}
			state.worlds[world.name] = world;
		},

		displayMDP(state) {
			state.focus = "mdp";
		},

		displayCreator(state) {
			state.focus = "creator";
		},

		displaySolution(state) {
			state.focus = "solution";
		},

		displaySelector(state) {
			state.focus = "selector";
		},

		displaySaver(state) {
			state.focus = "saver";
		},

		setPlotData(state, data) {
			state.savedPlotData = data;
		}
	}
});

export default store;