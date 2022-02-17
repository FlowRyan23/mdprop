import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		discount: 0.9,				// the default discount applied to every action (overridden wehn individual discounts are givin)
		stepCost: 0,				// the default stepCost applied to every action (overridden wehn individual costs are givin)
		useRounded: true,
		
		//stepChances
		scFront: 0.8,
		scLeft: 0.1,
		scRight: 0.1,
		scBack: 0,

		// display
		displayIteration: 0,
		tileWidth: 100,
		tileHeight: 100,
		
		focus: "mdp",		// "mdp": Standard GridMDP view; "creator": Level Creator Dialog; "solution": Solution Downloader
		reachedPreview: false,
		renderMode: "values",
		
		// advanced settings
		enableActionEditing: false,
		
		// default level
		level: [
			[
				{"accessible":true,"reward":0,"terminal":false,"initial":false},
				{"accessible":true,"reward":0,"terminal":false,"initial":false},
				{"accessible":true,"reward":0,"terminal":false,"initial":true},
				{"accessible":true,"reward":1,"terminal":true,"initial":false}
			],
			[
				{"accessible":true,"reward":0,"terminal":false,"initial":false},
				{"accessible":false,"reward":0,"terminal":false,"initial":false},
				{"accessible":true,"reward":0,"terminal":false,"initial":false},
				{"accessible":true,"reward":-1,"terminal":true,"initial":false}
			],
			[
				{"accessible":true,"reward":0,"terminal":false,"initial":false},
				{"accessible":true,"reward":0,"terminal":false,"initial":false},
				{"accessible":true,"reward":0,"terminal":false,"initial":false},
				{"accessible":true,"reward":0,"terminal":false,"initial":false}
			]
		]
	},

	mutations: {
		setLevel(state, level) {
			state.level = level;
		},

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

		toggleReachedPreview(state) {
			state.reachedPreview = !state.reachedPreview;
		},

		toggleRounded(state) {
			state.useRounded = !state.useRounded;
		},

		displayMDP(state) {
			state.focus = "mdp";
		},

		displayCreator(state) {
			state.focus = "creator";
		},

		displaySolution(state) {
			state.focus = "solution";
		}
	}
});

export default store;