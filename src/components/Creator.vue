<template>
	<v-overlay :value="true">
		<v-card id="card">
			<h2 id="headline">Create new Level</h2>

			<div class="d-flex">
				<div id="settings" class="d-flex flex-column">
					<div id="size" class="d-flex">
						<v-text-field
							label="Width"
							placeholder="Width"
							v-model="width"
							min="1"
							:max="maxWidth"
							class="mt-0 pt-0"
							type="number"
							style="width: 60px"
						></v-text-field>

						<p id="sizeSeperator">x</p>

						<v-text-field
							label="Height"
							placeholder="Height"
							v-model="height"
							min="1"
							class="mt-0 pt-0"
							type="number"
							style="width: 60px"
						></v-text-field>
					</div>

					<v-text-field
						label="Goals"
						placeholder="Number of Goals"
						v-model="goals"
						min="1"
						class="mt-0 pt-0"
						type="number"
						style="width: 60px"
					></v-text-field>

					<v-text-field
						label="Deaths"
						placeholder="Number of Deaths"
						v-model="deaths"
						min="1"
						class="mt-0 pt-0"
						type="number"
						style="width: 60px"
					></v-text-field>

					<v-slider v-model="connectivity" :step="0.01" :max="1" :min="0" :label="'Connectivity'" hide-details>
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
				</div>

				<div v-if="false && store.state.settings.enableAdvancedSettings" id="constraints">
					<BoolConstraintInput ref="fullReachability" class="no-pad" :name="'Fully Reachable'" />
					<BoolConstraintInput ref="winnable" class="no-pad" :name="'Winnable'" />
					<BoolConstraintInput ref="losable" class="no-pad" :name="'Losable'" />
					<BoolConstraintInput ref="noUnreachableGoal" class="no-pad" :name="'No Unreachable Goals'" />
					<BoolConstraintInput ref="noUnreachableDeath" class="no-pad" :name="'No Unreachable Deaths'" />
					<BoolConstraintInput ref="fullyReachableGoals" class="no-pad" :name="'Fully Reachable Goals'" />
					<BoolConstraintInput ref="fullyReachableDeaths" class="no-pad" :name="'Fully Reachable Deaths'" />
					<BoolConstraintInput ref="unambigousPolicy" class="no-pad" :name="'Unambiguous'" />
					<BoolConstraintInput ref="fullyAmbigousPolicy" class="no-pad" :name="'Fully Ambiguous'" />
				</div>
			</div>
			
			<v-btn @click="create()">create</v-btn>
		</v-card>
	</v-overlay>
</template>

<script>
import store from '../logic/sharedData';
import Requirements from '../logic/checks';
import BoolConstraintInput from './BoolConstraintInput';

export default {
	components: {BoolConstraintInput},

	data() {return {
		store: store,
		width: 9,
		height: 7,
		goals: 1,
		deaths: 1,
		connectivity: 0.3,
		test: null
	}},

	methods: {
		create() {
			let reqs = new Requirements();
			reqs.size.width = this.width;
			reqs.size.height = this.height;
			reqs.connectivity = this.connectivity;

			reqs.numberOfGoals = this.goals;
			reqs.numberOfDeaths = this.deaths;

			//todo coment in here and remove false in the template
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
			
			this.test = reqs;
			this.$parent.create(reqs);
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