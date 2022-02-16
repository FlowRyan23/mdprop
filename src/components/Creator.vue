<template>
	<v-overlay :value="true">
		<v-card id="card">
			<h2 id="headline">Create new Level</h2>

			<div class="d-flex">
				<div id="settings" class="d-flex flex-column">

					<!-- Size -->
					<div class="d-flex">
						<v-text-field
							label="Width"
							placeholder="Width"
							v-model="width"
							min="1"
							class="mt-0 pt-0"
							type="number"
							style="margin-right: 8px"
						></v-text-field>

						<v-text-field
							label="Height"
							placeholder="Height"
							v-model="height"
							min="1"
							class="mt-0 pt-0"
							type="number"
						></v-text-field>
					</div>

					<!-- Goals and Traps -->
					<div class="d-flex">
						<v-text-field
							label="Goals"
							placeholder="Number of Goals"
							v-model="goals"
							min="0"
							class="mt-0 pt-0"
							type="number"
							style="margin-right: 8px"
						></v-text-field>

						<v-text-field
							label="Traps"
							placeholder="Number of Traps"
							v-model="traps"
							min="0"
							class="mt-0 pt-0"
							type="number"
						></v-text-field>
					</div>

					<v-select
						v-model="selectedAlgorithm"
						:items="carvingAlgorithms"
						item-text="name"
						item-value="carver"
						label="Carving Algorithm"
						return-object
						>
					</v-select>

					<v-slider v-if="selectedAlgorithm==='Random'" v-model="connectivity" :step="0.01" :max="1" :min="0" :label="'Connectivity'" hide-details>
						<template v-slot:append>
							<v-text-field
								v-model="connectivity"
								class="mt-0 pt-0"
								hide-details
								single-line
								type="number"
								style="width: 60px"
							></v-text-field>
						</template>
					</v-slider>

					<v-switch label="Braid" v-model="braid"></v-switch>
				</div>

				<div v-if="store.state.settings.enableAdvancedSettings" id="constraints">
					<BoolConstraintInput ref="fullReachability" class="no-pad" :name="'Fully Reachable'" />
					<BoolConstraintInput ref="winnable" class="no-pad" :name="'Winnable'" />
					<BoolConstraintInput ref="survivable" class="no-pad" :name="'Survivable'" />
					<BoolConstraintInput ref="dangerous" class="no-pad" :name="'Dangerous'" />
					<BoolConstraintInput ref="ambigousPolicy" class="no-pad" :name="'Ambiguous Policy'" />
					<BoolConstraintInput ref="trivialPolicy" class="no-pad" :name="'Trivial Policy'" />
				</div>
			</div>
			
			<v-btn @click="create()" style="margin-right: 32px">create</v-btn>
			<v-btn @click="store.commit('displayMDP')">cancel</v-btn>
		</v-card>
	</v-overlay>
</template>

<script>
import store from '../logic/sharedData';
import Requirements from '../logic/checks';
import BoolConstraintInput from './BoolConstraintInput';
import {carveDFS} from '../logic/maze_generators/backtracker';
import carveKruskal from '../logic/maze_generators/kruskal';
import {hamiltonian} from '../logic/maze_generators/unicursal';
import { carveRandom } from '../logic/maze_generators/random';

export default {
	components: {BoolConstraintInput},

	data() {return {
		store: store,
		width: 5,
		height: 5,
		goals: 1,
		traps: 0,
		connectivity: 0.6,
		braid: false,
		carvingAlgorithms: [
			"Recursive Backtracking",
			"Kruskal",
			"Unicursal",
			"Random"
		],
		algTable: {
			"Recursive Backtracking": carveDFS,
			"Kruskal": carveKruskal,
			"Unicursal": hamiltonian,
			"Random": carveRandom
		},
		selectedAlgorithm: "Recursive Backtracking",
		test: null
	}},

	methods: {
		create() {
			let reqs = new Requirements();
			reqs.size.width = this.width;
			reqs.size.height = this.height;
			reqs.carver = this.algTable[this.selectedAlgorithm];
			reqs.braid = this.braid;
			reqs.carverArgs.chance = this.connectivity;

			reqs.numberOfGoals = this.goals;
			reqs.numberOfTraps = this.traps;

			//todo fix -> constraints have changed and implementation is ugly
		//	if (this.store.state.settings.enableAdvancedSettings) {
		//		reqs.fullReachability = this.$refs["fullReachability"].value;
		//		reqs.winnable = this.$refs["winnable"].value;
		//		reqs.losable = this.$refs["losable"].value;
		//		reqs.noUnreachableGoal = this.$refs["noUnreachableGoal"].value;
		//		reqs.noUnreachableDeath = this.$refs["noUnreachableDeath"].value;
		//		reqs.fullyReachableGoals = this.$refs["fullyReachableGoals"].value;
		//		reqs.fullyReachableDeaths = this.$refs["fullyReachableDeaths"].value;
		//		reqs.unambigousPolicy = this.$refs["unambigousPolicy"].value;
		//		reqs.fullyAmbigousPolicy = this.$refs["fullyAmbigousPolicy"].value;
		//	}
			
			this.$emit("create", reqs)
		}
	},

	computed: {
		maxWidth() {
			return store.state.settings.maxWidth;
		}
	}
}
</script>

<style scoped>
	* {
		margin-bottom: 0px
	}
	
	#card {
		padding: 16px;
		min-width: 700px;
	}

	#headline {
		margin-bottom: 16px;
	}

	#sizeSeperator {
		margin-left: 8px;
		margin-right: 8px
	}

	#settings {
		/* display: flex;
		flex-flow: column nowrap; */
		/* align-content: flex-start;
		justify-content: flex-start; */
		width: 40%;
		padding: 8px;
		margin-right: 25px;
	}

	#constraints {
		width: 60%;
		padding: 8px;
	}
</style>