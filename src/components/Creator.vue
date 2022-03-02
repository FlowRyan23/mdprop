<template>
	<v-overlay :value="true">
		<v-card id="card">
			<h2 id="headline">{{$t('creator.title')}}</h2>

			<div class="d-flex">
				<div class="d-flex flex-column justify-space-between" id="general">
					<!-- Size -->
					<div class="d-flex" style="margin-top: 18px">
						<v-text-field
							:label="$t('creator.width')"
							:placeholder="$t('creator.width')"
							v-model="width"
							min="1"
							class="mt-0 pt-0"
							type="number"
							style="margin-right: 8px"
							@wheel.prevent="scrollHandler($event, 'width', min=1)"
						></v-text-field>

						<v-text-field
							:label="$t('creator.height')"
							:placeholder="$t('creator.height')"
							v-model="height"
							min="1"
							class="mt-0 pt-0"
							type="number"
							@wheel.prevent="scrollHandler($event, 'height', min=1)"
						></v-text-field>
					</div>

					<!-- Goals and Traps -->
					<div class="d-flex">
						<v-text-field
							:label="$t('creator.goals')"
							:placeholder="$t('creator.goals')"
							v-model="goals"
							min="0"
							class="mt-0 pt-0"
							type="number"
							style="margin-right: 8px"
							@wheel.prevent="scrollHandler($event, 'goals')"
						></v-text-field>

						<v-text-field
							:label="$t('creator.traps')"
							:placeholder="$t('creator.traps')"
							v-model="traps"
							min="0"
							class="mt-0 pt-0"
							type="number"
							@wheel.prevent="scrollHandler($event, 'traps')"
						></v-text-field>
					</div>

					<div>
						<BoolConstraintInput ref="connected" class="no-pad" :name="$t('creator.constraints.connected')" />
						<BoolConstraintInput ref="deadEnds" class="no-pad" :name="$t('creator.constraints.deadEnds')" />
						<BoolConstraintInput ref="winnable" class="no-pad" :name="$t('creator.constraints.winnable')" />
						<BoolConstraintInput ref="partiallyWinnable" class="no-pad" :name="$t('creator.constraints.partiallyWinnable')" />
						<BoolConstraintInput ref="survivable" class="no-pad" :name="$t('creator.constraints.survivable')" />
						<BoolConstraintInput ref="partiallySurvivable" class="no-pad" :name="$t('creator.constraints.partiallySurvivable')" />
						<BoolConstraintInput ref="dangerous" class="no-pad" :name="$t('creator.constraints.dangerous')" />
						<BoolConstraintInput ref="partiallyLost" class="no-pad" :name="$t('creator.constraints.partiallyLost')" />
						<BoolConstraintInput ref="lost" class="no-pad" :name="$t('creator.constraints.lost')" />
						<BoolConstraintInput ref="ambiguousPolicy" class="no-pad" :name="$t('creator.constraints.ambiguous')" />
						<BoolConstraintInput ref="trivialPolicy" class="no-pad" :name="$t('creator.constraints.trivial')"/>
					</div>
				</div>
				
				<div id="generator" class="d-flex flex-column">

					<v-select
						v-model="selectedAlgorithm"
						:items="carvingAlgorithms"
						item-text="name"
						item-value="carver"
						:label="$t('creator.alg')"
						return-object
						>
					</v-select>

					<v-slider v-if="selectedAlgorithm==='Random'" v-model="connectivity" :step="0.01" :max="1" :min="0" :label="$t('creator.connectivity')">
						<template v-slot:append>
							<v-text-field
								v-model="connectivity"
								class="mt-0 pt-0 no-spins"
								hide-details
								single-line
								type="number"
							></v-text-field>
						</template>
					</v-slider>

					<v-switch :label="$t('creator.braid')" v-model="braid"></v-switch>

					<Display
						v-if="preview"
						ref="previewDisplay"
						:ID="'preview'"
						:preview="true"
						:size="{width: 300, height: 250}"
						:mdp="preview"
						@interaction="noHandler"
					/>
					
				</div>
			</div>
			
			<div class="d-flex justify-space-between">
				<v-btn @click="confirm()" color="blue">{{$t('creator.confirm')}}</v-btn>
				<div></div>
				<v-btn @click="refreshPreview()">{{$t('creator.refresh')}}</v-btn>
				<v-btn @click="store.commit('displayMDP')">{{$t('creator.cancel')}}</v-btn>
			</div>
		</v-card>
	</v-overlay>
</template>

<script>
import store from '../logic/sharedData';
import Requirements from '../logic/checks';
import BoolConstraintInput from './BoolConstraintInput';
import Display from "./Display.vue";
import {carveDFS} from '../logic/maze_generators/backtracker';
import carveKruskal from '../logic/maze_generators/kruskal';
import {hamiltonian} from '../logic/maze_generators/unicursal';
import { carveRandom, carveSnake } from '../logic/maze_generators/random';
import create from '../logic/levelGeneration';

export default {
	components: {BoolConstraintInput, Display},

	data() {return {
		store: store,
		width: 9,
		height: 7,
		goals: 1,
		traps: 1,
		connectivity: 0.6,
		braid: false,
		carvingAlgorithms: [
			"Recursive Backtracking",
			"Kruskal",
			"Unicursal",
			"Random",
			"Snake"
		],
		algTable: {
			"Recursive Backtracking": carveDFS,
			"Kruskal": carveKruskal,
			"Unicursal": hamiltonian,
			"Random": carveRandom,
			"Snake": carveSnake
		},
		selectedAlgorithm: "Kruskal",
		preview: null
	}},

	methods: {
		confirm() {
			this.$emit("created", this.preview)
		},

		refreshPreview() {
			this.preview = null;
			this.test = this.requirements;
			create(this.requirements).then(mdp => {
				this.preview=mdp
				this.test = this.requirements.check(this.preview);
				// this.$refs.previewDisplay.render();
			});
		},

		scrollHandler(event, attribute, min=0, max=200) {
			if(event.deltaY > 0) {
				this[attribute] = Math.min(max, Math.max(min, this[attribute] - 1));
			} else {
				this[attribute] = Math.min(max, Math.max(min, this[attribute] + 1));
			}
		},
		
		noHandler() {}
	},

	computed: {
		requirements() {
			let reqs = new Requirements();
			reqs.size.width = this.width;
			reqs.size.height = this.height;
			reqs.carver = this.algTable[this.selectedAlgorithm];
			reqs.braid = this.braid;
			reqs.carverArgs.chance = this.connectivity;

			reqs.numberOfGoals = this.goals;
			reqs.numberOfTraps = this.traps;

			reqs.connected = this.$refs["connected"].value;
			reqs.deadEnds = this.$refs["deadEnds"].value;
			reqs.winnable = this.$refs["winnable"].value;
			reqs.partiallyWinnable = this.$refs["partiallyWinnable"].value;
			reqs.survivable = this.$refs["survivable"].value;
			reqs.partiallySurvivable = this.$refs["partiallySurvivable"].value;
			reqs.dangerous = this.$refs["dangerous"].value;
			reqs.partiallyLost = this.$refs["partiallyLost"].value;
			reqs.lost = this.$refs["lost"].value;
			reqs.ambiguousPolicy = this.$refs["ambiguousPolicy"].value;
			reqs.trivialPolicy = this.$refs["trivialPolicy"].value;

			reqs.reset();
			return reqs;
		}
	},

	mounted() {
			this.refreshPreview();
	}
}
</script>

<style scoped>
	* {
		margin-bottom: 0px
	}

	.no-spins input[type='number'] {
    -moz-appearance:textfield;
	}

	::v-deep input::-webkit-outer-spin-button,
	::v-deep input::-webkit-inner-spin-button {
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
	}
	
	#card {
		padding: 16px;
		min-width: 700px;
	}

	#headline {
		margin-bottom: 16px;
	}

	#sizeSeperator {
		margin-left: 16px;
		margin-right: 16px
	}

	#generator {
		/* display: flex;
		flex-flow: column nowrap; */
		/* align-content: flex-start;
		justify-content: flex-start; */
		width: 50%;
		padding: 8px;
	}

	#general {
		width: 50%;
		padding: 8px;
		margin-right: 25px;
	}
</style>