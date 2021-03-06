import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		defaultSettings: {
			stepCost: 0,				// the default stepCost applied to every action (overridden wehn individual costs are givin)
			discount: 0.9,				// the default discount applied to every action (overridden wehn individual discounts are givin)
			stepChances: {'front': 0.8, 'left': 0.1, 'right': 0.1, 'back': 0},
			useRounded: true,

			maxWidth: 255,				// level width (todo more than 12 makes layout look bad)
			maxHeight: 255,				// level height

			// advanced settings
			enableAdvancedSettings: false,
			tileWidth: 100,
			tileHeight: 100,
			tileInsets: 5,
			directionIndicatorSize: 6,
			detailedDisplay: false,

			hardReset: true,			// hardReset will undo all changes to the map made through the tile editor
			fullDisplay: false			// fullDisplay will show all q-values at every location not just the highest
		},

		settings: {},

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
		}
	}
});

export default store;