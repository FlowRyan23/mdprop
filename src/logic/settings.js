import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		settings: {
			stepCost: 0,				// the default stepCost applied to every action (overridden wehn individual costs are givin)
			discount: 0.9,			// the default discount applied to every action (overridden wehn individual discounts are givin)
			stepChances: [0.8, 0.1, 0.1, 0],

			hardReset: true,		// hardReset will undo all changes to the map made through the tile editor

			fullDisplay: false	// fullDisplay will show all q-values at every location not just the highest
		},

		displayIteration: 0
	},

	mutations: {
		setSettings(state, settings) {
			state.settings = settings;
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