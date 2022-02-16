import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		defaultSettings: {
			stepCost: 0,				// the default stepCost applied to every action (overridden wehn individual costs are givin)
			discount: 0.9,				// the default discount applied to every action (overridden wehn individual discounts are givin)
			//stepChances
			scFront: 0.8,
			scLeft: 0.1,
			scRight: 0.1,
			scBack: 0,
			useRounded: true,

			maxWidth: 255,				// level width (todo more than 12 makes layout look bad)
			maxHeight: 255,				// level height
			maxStepCost: 5,

			// advanced settings
			enableAdvancedSettings: true,
			enableActionEditing: false,
			tileWidth: 100,
			tileHeight: 100,
			tileInsets: 5,
			directionIndicatorSize: 6,
			detailedDisplay: false,
			
			hardReset: true,			// hardReset will undo all changes to the map made through the tile editor
			fullDisplay: false			// fullDisplay will show all q-values at every location not just the highest
		},
		
		settings: {},
		
		reachedPreview: false,
		displayMode: 1,		// 1: Standard GridMDP view; 2: Level Creator Dialog; 3: Solution Downloader

		displayIteration: 0,

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
		setSettings(state, settings) {
			state.settings = settings;
		},

		setZoom(state, zoom) {
			state.settings.tileWidth = zoom;
			state.settings.tileHeight = zoom;
		},

		setLevel(state, level) {
			state.level = level;
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

		toggleReachedPreview(state) {
			state.reachedPreview = !state.reachedPreview;
		},

		displayMDP(state) {
			state.displayMode = 1;
		},

		displayCreator(state) {
			state.displayMode = 2;
		},

		displayDownloader(state) {
			state.displayMode = 3;
		}
	}
});

export default store;