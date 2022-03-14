<template>
	<v-overlay :value="true" :dark="$vuetify.theme.dark">
		<v-card id="card">
			<v-card-title primary-title>
				{{$t('creator.title')}}

				<v-spacer></v-spacer>

				<v-btn @click="store.commit('displayMDP')" rounded icon>
					<v-icon size="32">mdi-close-thick</v-icon>
				</v-btn>
			</v-card-title>

				<div class="d-flex flex-column justify-space-between">
					<!-- Size -->
					<div class="d-flex" style="margin-top: 18px">
						<v-text-field
							id="num-input"
							:label="$t('creator.width')"
							:placeholder="$t('creator.width')"
							v-model="width"
							min="1"
							max="100"
							dense
							type="number"
							class="mt-0 mr-8 pt-0"
							@wheel.prevent="scrollHandler($event, 'width', min=1)"
						></v-text-field>

						<v-text-field
							id="num-input"
							:label="$t('creator.height')"
							:placeholder="$t('creator.height')"
							v-model="height"
							min="1"
							max="100"
							dense
							type="number"
							class="mt-0 pt-0"
							@wheel.prevent="scrollHandler($event, 'height', min=1)"
						></v-text-field>
					</div>

					<!-- Goals and Traps -->
					<div class="d-flex">
						<v-text-field
							id="num-input"
							:label="$t('creator.goals')"
							:placeholder="$t('creator.goals')"
							v-model="goals"
							min="0"
							dense
							type="number"
							class="mt-0 mr-8 pt-0"
							@wheel.prevent="scrollHandler($event, 'goals')"
						></v-text-field>

						<v-text-field
							id="num-input"
							:label="$t('creator.traps')"
							:placeholder="$t('creator.traps')"
							v-model="traps"
							min="0"
							dense
							type="number"
							class="mt-0 pt-0"
							@wheel.prevent="scrollHandler($event, 'traps')"
						></v-text-field>
					</div>
				</div>
				
				<div class="d-flex flex-column">
					<!-- Generator -->
					<v-select
						v-model="selectedAlgorithm"
						:items="carvingAlgorithms"
						:label="$t('creator.alg')"
						>
					</v-select>

					<div v-if="selectedAlgorithm==='Noise'">
						<!-- Bias -->
						<v-slider v-model="bias" :step="0.01" :max="1" :min="0" :label="$t('creator.bias')">
							<template v-slot:append>
								<v-text-field
									v-model="bias"
									class="mt-0 pt-0 no-spins"
									hide-details
									single-line
									type="number"
									style="width: 50px"
								></v-text-field>
							</template>
						</v-slider>
					</div>

					<v-switch v-else :label="$t('creator.braid')" v-model="braid" class="mt-0"></v-switch>

					<div class="d-flex justify-space-around mt-3">
						<Display
							v-if="preview"
							ref="previewDisplay"
							:ID="'preview'"
							:preview="true"
							:size="{width: 300, height: 250}"
							:mdp="preview"
							@interaction="()=>null"
						/>

						<div class="d-flex flex-column justify-space-between">
							<div></div>
							<!-- Refresh -->
							<v-tooltip right>
								<template v-slot:activator="{on, attrs}">
									<v-btn plain fab @click="refreshPreview()" v-on="on" v-bind="attrs">
										<v-icon large>mdi-refresh</v-icon>
									</v-btn>
								</template>
								<span>{{$t('creator.refresh')}}</span>
							</v-tooltip>

							<!-- Confirm -->
							<v-tooltip right>
								<template v-slot:activator="{on, attrs}">
									<v-btn plain fab @click="confirm()" color="hsl(100, 100%, 40%)" v-on="on" v-bind="attrs">
										<v-icon large>mdi-check</v-icon>
									</v-btn>
								</template>
								<span>{{$t('creator.confirm')}}</span>
							</v-tooltip>
						</div>
					</div>
				</div>
		</v-card>
	</v-overlay>
</template>

<script>
import store from '../logic/sharedData';
import Requirements from '../logic/checks';
import Display from "./Display.vue";
import carveKruskal from '../logic/maze_generators/kruskal';
import { carveNoise } from '../logic/maze_generators/random';
import create from '../logic/levelGeneration';

export default {
	components: {Display},

	data() {return {
		store: store,
		preview: null,

		// universal settings
		width: 7,
		height: 5,
		goals: 1,
		traps: 1,
		carvingAlgorithms: [
			"Labyrinth",
			"Noise",
		],
		algTable: {
			"Labyrinth": carveKruskal,
			"Noise": carveNoise
		},
		selectedAlgorithm: "Labyrinth",

		// noise args
		noiseGen: "perlin",
		bias: 0.47,
		blur: false,
		selectedKernel: "gaus3",

		// perlin noise
		frequency: 4,

		// fractal noise
		fractal: true,
		octaves: 4,
		fractalFrequency: 1,
		persistence: 0.8,

		// post processing
		braid: false
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

		scrollHandler(event, attribute, min=0, max=50) {
			if(event.deltaY > 0) {
				this[attribute] = Math.min(max, Math.max(min, this[attribute] - 1));
			} else {
				this[attribute] = Math.min(max, Math.max(min, this[attribute] + 1));
			}
		}
	},

	computed: {
		requirements() {
			let reqs = new Requirements();
			reqs.size.width = this.width;
			reqs.size.height = this.height;
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

			reqs.numberOfGoals = this.goals;
			reqs.numberOfTraps = this.traps;

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
		width: 400px;
		height: 600px
	}

</style>