<template>
	<v-overlay :value="true" :dark="$vuetify.theme.dark">
		<v-card id="card">
			<v-card-title>
				{{$t('creator.title')}}

				<v-spacer></v-spacer>

				<v-btn @click="store.commit('displayMDP')" rounded icon>
					<v-icon size="32">mdi-close-thick</v-icon>
				</v-btn>


			</v-card-title>

			<v-tabs v-model="currentTab" fixed-tabs>
				<v-tabs-slider color="blue"></v-tabs-slider>
				<v-tab :key="'basic'">{{$t('creator.tab.basic')}}</v-tab>
				<v-tab :key="'generator'">{{$t('creator.tab.generator')}}</v-tab>
				<v-tab :key="'constraints'">{{$t('creator.tab.constraints')}}</v-tab>
			</v-tabs>

			<v-tabs-items v-model="currentTab">
				<v-tab-item :key="'basic'">
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
					</div>			
				</v-tab-item>
				
				<v-tab-item :key="'generator'">
					<div id="generator" class="d-flex flex-column">

						<v-select
							v-model="selectedAlgorithm"
							:items="carvingAlgorithms"
							:label="$t('creator.alg')"
							>
						</v-select>

						<div v-if="selectedAlgorithm==='Noise'">
							<v-select
								v-model="noiseGen"
								:items="noiseGenerators"
								:label="$t('creator.noiseGen')"
								>
							</v-select>

							<v-slider v-if="noiseGen==='perlin' && !fractal" v-model="frequency" :step="1" :max="50" :min="1" :label="$t('creator.frequency')">
								<template v-slot:append>
									<v-text-field
										v-model="frequency"
										class="mt-0 pt-0 no-spins"
										hide-details
										single-line
										type="number"
									></v-text-field>
								</template>
							</v-slider>

							<v-switch :label="$t('creator.fractal')" v-model="fractal"></v-switch>

							<div v-if="fractal">
								<v-slider v-model="octaves" :step="1" :max="10" :min="1" ticks :label="$t('creator.octaves')">
									<template v-slot:append>
										<v-text-field
											v-model="octaves"
											class="mt-0 pt-0 no-spins"
											hide-details
											single-line
											type="number"
										></v-text-field>
									</template>
								</v-slider>

								<v-slider v-model="fractalFrequency" :step="1" :max="10" :min="1" ticks :label="$t('creator.fractalFrequency')">
									<template v-slot:append>
										<v-text-field
											v-model="fractalFrequency"
											class="mt-0 pt-0 no-spins"
											hide-details
											single-line
											type="number"
										></v-text-field>
									</template>
								</v-slider>

								<v-slider v-model="persistence" :step="0.1" :max="1" :min="0" ticks :label="$t('creator.persistence')">
									<template v-slot:append>
										<v-text-field
											v-model="persistence"
											class="mt-0 pt-0 no-spins"
											hide-details
											single-line
											type="number"
										></v-text-field>
									</template>
								</v-slider>
							</div>

							<v-switch :label="$t('creator.blur')" v-model="blur"></v-switch>
							<v-select
								v-if="blur"
								:items="blurKernels"
								v-model="selectedKernel"
								:label="$t('creator.kernel')"
							></v-select>

							<v-slider v-model="bias" :step="0.01" :max="1" :min="0" :label="$t('creator.bias')">
								<template v-slot:append>
									<v-text-field
										v-model="bias"
										class="mt-0 pt-0 no-spins"
										hide-details
										single-line
										type="number"
									></v-text-field>
								</template>
							</v-slider>

						</div>
						<v-switch :label="$t('creator.braid')" v-model="braid"></v-switch>

						
					</div>
				</v-tab-item>

				<v-tab-item :key="'constraints'">
					<div>
						<BoolConstraintInput :ref="'connected'" :initialValue="constraints.connected" class="no-pad" :name="$t('creator.constraints.connected')" />
						<BoolConstraintInput :ref="'deadEnds'" :initialValue="constraints.deadEnds" class="no-pad" :name="$t('creator.constraints.deadEnds')" />
						<BoolConstraintInput :ref="'winnable'" :initialValue="constraints.winnable" class="no-pad" :name="$t('creator.constraints.winnable')" />
						<BoolConstraintInput :ref="'partiallyWinnable'" :initialValue="constraints.partiallyWinnable" class="no-pad" :name="$t('creator.constraints.partiallyWinnable')" />
						<BoolConstraintInput :ref="'survivable'" :initialValue="constraints.survivable" class="no-pad" :name="$t('creator.constraints.survivable')" />
						<BoolConstraintInput :ref="'partiallySurvivable'" :initialValue="constraints.partiallySurvivable" class="no-pad" :name="$t('creator.constraints.partiallySurvivable')" />
						<BoolConstraintInput :ref="'dangerous'" :initialValue="constraints.dangerous" class="no-pad" :name="$t('creator.constraints.dangerous')" />
						<BoolConstraintInput :ref="'partiallyLost'" :initialValue="constraints.partiallyLost" class="no-pad" :name="$t('creator.constraints.partiallyLost')" />
						<BoolConstraintInput :ref="'lost'" :initialValue="constraints.lost" class="no-pad" :name="$t('creator.constraints.lost')" />
						<BoolConstraintInput :ref="'ambiguousPolicy'" :initialValue="constraints.ambiguousPolicy" class="no-pad" :name="$t('creator.constraints.ambiguous')" />
						<BoolConstraintInput :ref="'trivialPolicy'" :initialValue="constraints.trivialPolicy" class="no-pad" :name="$t('creator.constraints.trivial')"/>
					</div>
				</v-tab-item>
			</v-tabs-items>
			
			<Display
				v-if="preview"
				ref="previewDisplay"
				:ID="'preview'"
				:preview="true"
				:size="{width: 300, height: 250}"
				:mdp="preview"
				@interaction="noHandler"
			/>

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
import { carveNoise, carveSnake } from '../logic/maze_generators/random';
import create from '../logic/levelGeneration';

export default {
	components: {BoolConstraintInput, Display},

	data() {return {
		store: store,
		preview: null,
		currentTab: "",

		// basic settings
		width: 5,
		height: 5,
		goals: 1,
		traps: 0,
		carvingAlgorithms: [
			"Recursive Backtracking",
			"Kruskal",
			"Unicursal",
			"Noise",
			"Snake"
		],
		algTable: {
			"Recursive Backtracking": carveDFS,
			"Kruskal": carveKruskal,
			"Unicursal": hamiltonian,
			"Noise": carveNoise,
			"Snake": carveSnake
		},
		selectedAlgorithm: "Kruskal",

		// noise args
		noiseGenerators: ["white", "perlin"],
		noiseGen: "white",
		bias: 0.5,
		blur: false,
		blurKernels: ["gaus3"],
		selectedKernel: "gaus3",

		// perlin noise
		frequency: 4,

		// fractal noise
		fractal: false,
		octaves: 4,
		fractalFrequency: 1,
		persistence: 0.8,

		// post processing
		braid: false,

		//constraints
		constraints:  {
			connected : 'optional',
			deadEnds : 'optional',
			winnable : 'required',
			partiallyWinnable : 'forbidden',
			survivable : 'required',
			partiallySurvivable : 'forbidden',
			dangerous : 'required',
			partiallyLost : 'optional',
			lost : 'forbidden',
			ambiguousPolicy : 'required',
			trivialPolicy : 'optional'
		}
	}},

	methods: {
		confirm() {
			this.$emit("created", this.preview)
		},

		runEvaluation() {
			
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
			reqs.width = this.width;
			reqs.height = this.height;
			reqs.carver = this.algTable[this.selectedAlgorithm];
			reqs.braid = this.braid;
			reqs.carverArgs.width = this.width;
			reqs.carverArgs.height = this.height;
			reqs.carverArgs.bias = this.bias;
			reqs.carverArgs.generator = this.noiseGen;
			reqs.carverArgs.blur = this.blur;
			reqs.carverArgs.kernel = this.selectedKernel;
			reqs.carverArgs.frequency = this.frequency;
			reqs.carverArgs.fractal = this.fractal;
			reqs.carverArgs.octaves = this.octaves;
			reqs.carverArgs.fractalFrequency = this.fractalFrequency;
			reqs.carverArgs.amplitude = 1;
			reqs.carverArgs.persistence = this.persistence;

			reqs.goals = this.goals;
			reqs.traps = this.traps;

			for (const key in this.constraints) {
				reqs[key] = this.$refs[key]? this.$refs[key].value : this.constraints[key];
			}
			// reqs.connected = this.$refs["connected"]?this.$refs["connected"].value:this.constraints.connected;
			// reqs.deadEnds = this.$refs["deadEnds"]?this.$refs["deadEnds"].value:this.constraints.deadEnds;
			// reqs.winnable = this.$refs["winnable"]?this.$refs["winnable"].value:this.constraints.winnable;
			// reqs.partiallyWinnable = this.$refs["partiallyWinnable"]?this.$refs["partiallyWinnable"].value:this.constraints.partiallyWinnable;
			// reqs.survivable = this.$refs["survivable"]?this.$refs["survivable"].value:this.constraints.survivable;
			// reqs.partiallySurvivable = this.$refs["partiallySurvivable"]?this.$refs["partiallySurvivable"].value:this.constraints.partiallySurvivable;
			// reqs.dangerous = this.$refs["dangerous"]?this.$refs["dangerous"].value:this.constraints.dangerous;
			// reqs.partiallyLost = this.$refs["partiallyLost"]?this.$refs["partiallyLost"].value:this.constraints.partiallyLost;
			// reqs.lost = this.$refs["lost"]?this.$refs["lost"].value:this.constraints.lost;
			// reqs.ambiguousPolicy = this.$refs["ambiguousPolicy"]?this.$refs["ambiguousPolicy"].value:this.constraints.ambiguousPolicy;
			// reqs.trivialPolicy = this.$refs["trivialPolicy"]?this.$refs["trivialPolicy"].value:this.constraints.trivialPolicy;

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

	#sizeSeperator {
		margin-left: 16px;
		margin-right: 16px
	}
</style>