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

			<v-tabs-items class="ma-4" v-model="currentTab">
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

					<div class="d-flex">
						<v-slider class="mt-3" v-model="discount" :min="0" :max="1" :step="0.01" :label="$t('settings.discount')" hide-details @change="setDiscount">
							<template v-slot:append>
								<v-text-field
									v-model="discount"
									class="number-field mt-0 pt-0 no-spins"
									hide-details
									single-line
									type="number"
									@change="setDiscount"
								></v-text-field>
							</template>
						</v-slider>
	
						<v-btn plain fab @click="displayFavDiscount = !displayFavDiscount">
							<v-icon>mdi-star-outline</v-icon>
						</v-btn>
					</div>

					<div class="d-flex">
						<v-slider class="mt-1" v-model="stepCost" :min="0" :max="5" :step="0.01" :label="$t('settings.stepCost')" hide-details @change="setStepCost">
							<template v-slot:append>
								<v-text-field
									v-model="stepCost"
									class="number-field mt-0 pt-0 no-spins"
									hide-details
									single-line
									type="number"
									@change="setStepCost"
								></v-text-field>
							</template>
						</v-slider>

						<v-btn plain fab @click="displayFavStepCost = !displayFavStepCost" style="margin-top: -8px">
							<v-icon>mdi-star-outline</v-icon>
						</v-btn>
					</div>

					<div class="d-flex mb-8">
						<v-slider class="mt-3" v-model="noise" :min="0" :max="1" :step="0.01" :label="$t('settings.noise')" hide-details @change="setStepChances">
							<template v-slot:append>
								<v-text-field
									v-model="noise"
									class="number-field mt-0 pt-0 no-spins"
									hide-details
									single-line
									type="number"
									@change="setStepChances"
								></v-text-field>
							</template>
						</v-slider>

						<v-btn plain fab @click="displayFavNoise = !displayFavNoise" >
							<v-icon>mdi-star-outline</v-icon>
						</v-btn>
					</div>

					<div class="d-flex justify-center">
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
				</v-tab-item>
				
				<v-tab-item :key="'generator'">
					<v-btn-toggle id="generatorSelect" mandatory v-model="generator">
						<v-tooltip right>
							<template v-slot:activator="{on, attrs}">
								<v-btn :color="generator === 'perfect'?'primary':''" :value="'perfect'" v-on="on" v-bind="attrs">
									{{$t('creator.quickGenerators.perfect')}}
								</v-btn>
							</template>
							<span>{{$t('creator.quickGenerators.perfectHint')}}</span>
						</v-tooltip>

						<v-tooltip right>
							<template v-slot:activator="{on, attrs}">
								<v-btn :color="generator === 'braid'?'primary':''" :value="'braid'" v-on="on" v-bind="attrs">
									{{$t('creator.quickGenerators.braid')}}
								</v-btn>
							</template>
							<span>{{$t('creator.quickGenerators.braidHint')}}</span>
						</v-tooltip>

						<v-tooltip right>
							<template v-slot:activator="{on, attrs}">
								<v-btn :color="generator === 'unicursal'?'primary':''" :value="'unicursal'" v-on="on" v-bind="attrs">
									{{$t('creator.quickGenerators.unicursal')}}
								</v-btn>
							</template>
							<span>{{$t('creator.quickGenerators.unicursalHint')}}</span>
						</v-tooltip>

						<v-tooltip right>
							<template v-slot:activator="{on, attrs}">
								<v-btn :color="generator === 'erdos'?'primary':''" :value="'erdos'" v-on="on" v-bind="attrs">
									{{$t('creator.quickGenerators.erdos')}}
								</v-btn>
							</template>
							<span>{{$t('creator.quickGenerators.erdosHint')}}</span>
						</v-tooltip>

						<v-tooltip right>
							<template v-slot:activator="{on, attrs}">
								<v-btn :color="generator === 'white'?'primary':''" :value="'white'" v-on="on" v-bind="attrs">
									{{$t('creator.quickGenerators.white')}}
								</v-btn>
							</template>
							<span>{{$t('creator.quickGenerators.whiteHint')}}</span>
						</v-tooltip>

						<v-tooltip right>
							<template v-slot:activator="{on, attrs}">
								<v-btn :color="generator === 'whiteBlur'?'primary':''" :value="'whiteBlur'" v-on="on" v-bind="attrs">
									{{$t('creator.quickGenerators.whiteBlur')}}
								</v-btn>
							</template>
							<span>{{$t('creator.quickGenerators.whiteBlurHint')}}</span>
						</v-tooltip>

						<v-tooltip right>
							<template v-slot:activator="{on, attrs}">
								<v-btn :color="generator === 'perlin'?'primary':''" :value="'perlin'" v-on="on" v-bind="attrs">
									{{$t('creator.quickGenerators.perlin')}}
								</v-btn>
							</template>
							<span>{{$t('creator.quickGenerators.perlinHint')}}</span>
						</v-tooltip>

						<v-tooltip right>
							<template v-slot:activator="{on, attrs}">
								<v-btn :color="generator === 'fractal'?'primary':''" :value="'fractal'" v-on="on" v-bind="attrs">
									{{$t('creator.quickGenerators.fractal')}}
								</v-btn>
							</template>
							<span>{{$t('creator.quickGenerators.fractalHint')}}</span>
						</v-tooltip>
					</v-btn-toggle>
				</v-tab-item>

				<v-tab-item :key="'constraints'">
					<div>
						<BoolConstraintInput @set="checkConstraint('connected')" :ref="'connected'" :initialValue="constraints.connected" class="no-pad" :name="'connected'" />
						<BoolConstraintInput @set="checkConstraint('deadEnds')" :ref="'deadEnds'" :initialValue="constraints.deadEnds" class="no-pad" :name="'deadEnds'" />
						<BoolConstraintInput @set="checkConstraint('winnable')" :ref="'winnable'" :initialValue="constraints.winnable" class="no-pad" :name="'winnable'" />
						<BoolConstraintInput @set="checkConstraint('partiallyWinnable')" :ref="'partiallyWinnable'" :initialValue="constraints.partiallyWinnable" class="no-pad" :name="'partiallyWinnable'" />
						<BoolConstraintInput @set="checkConstraint('survivable')" :ref="'survivable'" :initialValue="constraints.survivable" class="no-pad" :name="'survivable'" />
						<BoolConstraintInput @set="checkConstraint('partiallySurvivable')" :ref="'partiallySurvivable'" :initialValue="constraints.partiallySurvivable" class="no-pad" :name="'partiallySurvivable'" />
						<BoolConstraintInput @set="checkConstraint('partiallyDangerous')" :ref="'partiallyDangerous'" :initialValue="constraints.dangerous" class="no-pad" :name="'partiallyDangerous'" />
						<BoolConstraintInput @set="checkConstraint('dangerous')" :ref="'dangerous'" :initialValue="constraints.dangerous" class="no-pad" :name="'dangerous'" />
						<BoolConstraintInput @set="checkConstraint('partiallyLost')" :ref="'partiallyLost'" :initialValue="constraints.partiallyLost" class="no-pad" :name="'partiallyLost'" />
						<BoolConstraintInput @set="checkConstraint('lost')" :ref="'lost'" :initialValue="constraints.lost" class="no-pad" :name="'lost'" />
						<BoolConstraintInput @set="checkConstraint('unambiguous')" :ref="'unambiguous'" :initialValue="constraints.unambiguous" class="no-pad" :name="'unambiguous'" />
						<BoolConstraintInput @set="checkConstraint('trivial')" :ref="'trivial'" :initialValue="constraints.trivial" class="no-pad" :name="'trivial'"/>
					</div>
				</v-tab-item>
			</v-tabs-items>

			<div class="d-flex justify-space-between">
				<v-btn @click="confirm()" color="blue">{{$t('creator.confirm')}}</v-btn>
				<v-btn @click="refreshPreview()">{{$t('creator.refresh')}}</v-btn>
				<v-btn @click="store.commit('displayMDP')">{{$t('creator.cancel')}}</v-btn>
			</div>
		</v-card>

		<v-snackbar
			v-model="message"
			:timeout="msgTimeout"
			:color="msgColor">
			{{msgText}}
			<template v-slot:action="{attrs}">
				<v-btn v-bind="attrs" text @click.native="message = false">
					{{$t('toolbar.message.close')}}
				</v-btn>
			</template>
		</v-snackbar>
	</v-overlay>
</template>

<script>
import store from '../logic/sharedData';
import Requirements from '../logic/checks';
import BoolConstraintInput from './BoolConstraintInput';
import Display from "./Display.vue";
import {carveDFS} from '../logic/maze_generators/backtracker';
import carveKruskal, { carveErdosReny } from '../logic/maze_generators/kruskal';
import {carveUnicursal} from '../logic/maze_generators/unicursal';
import { carveNoise, carveSnake } from '../logic/maze_generators/random';
import create from '../logic/levelGeneration';
import { log } from '../logic/util';

export default {
	components: {BoolConstraintInput, Display},

	data() {return {
		store: store,
		preview: null,
		currentTab: "",

		// quick-select generators
		generator: "perfect",

		// basic settings
		width: 7,
		height: 5,
		goals: 1,
		traps: 1,
		discount: 0.9,
		stepCost: 0,
		noise: 0.2,

		carvingAlgorithms: [
			"Recursive Backtracking",
			"Kruskal",
			"Unicursal",
			"Noise",
			"Snake",
			"Erdos"
		],
		algTable: {
			"Recursive Backtracking": carveDFS,
			"Kruskal": carveKruskal,
			"Unicursal": carveUnicursal,
			"Noise": carveNoise,
			"Snake": carveSnake,
			"Erdos": carveErdosReny,
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
		// constraints:  {
		// 	connected : 'required',
		// 	deadEnds : 'required',
		// 	winnable : 'required',
		// 	partiallyWinnable : 'required',
		// 	survivable : 'required',
		// 	partiallySurvivable : 'required',
		// 	partiallyDangerous: 'required',
		// 	dangerous : 'required',
		// 	partiallyLost : 'required',
		// 	lost : 'required',
		// 	unambiguous : 'required',
		// 	trivial : 'required'
		// },
		constraints:  {
			connected : 'required',
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
		},

		// message dialogues
		message: false,
		msgText: "",
		msgColor: "",
		msgTimeout: 2000,

		test: null
	}},

	methods: {
		confirm() {
			this.$emit("created", this.preview)
		},

		refreshPreview() {
			this.preview = null;
			this.message = false;
			var reqs = this.requirements();
			create(reqs).then(result => {
				if (!result.mdp) {
					this.showMessage(this.$t('creator.messages.failure'), "error");
				} else if (result.status === "failure") {
					
					// this.test = reqs;

					let failedConstraints = [];
					for (const c in reqs.satisfaction) {
						if (!reqs.satisfaction[c]) {
							failedConstraints.push(c);
						}
					}

					let msgArgs = {
						failed: failedConstraints.map(c => this.$t('creator.constraints.' + c)).join(', ')
					};
					this.showMessage(this.$t('creator.messages.unsatisfiedConstraint', msgArgs), 'warning');
				}

				if(store.state.dev) {
					log(reqs.satisfaction.connected);
				}

				this.preview=result.mdp;
				// this.$refs.previewDisplay.render();
				this.currentTab = "basic";
			});
		},

		setDiscount() {

		},

		setStepCost() {

		},

		setStepChances() {

		},

		checkConstraint(key) {
			let value = this.getConstraintValue(key);

			// TODO partiallyDangerous
			switch (key) {
				case "winnable":
					if (value === "required") {
						if (this.goals === 0) {
							let msgArgs = {
								constraint: this.$t('creator.constraints.winnable'),
								nGoals: 1
							};
							this.showMessage(this.$t('creator.messages.minimumGoals', msgArgs), "warning");
							
							this.goals = 1;
						}

						if(this.getConstraintValue("partiallyWinnable") !== "forbidden") {
							let msgArgs = {
								nameA: this.$t('creator.constraints.winnable'),
								valueA: this.$t('creator.constraints.' + value),
								nameB: this.$t('creator.constraints.partiallyWinnable'),
								valueB: this.$t('creator.constraints.' + this.getConstraintValue("partiallyWinnable"))
							}
							this.showMessage(this.$t('creator.messages.incompatibleConstraints', msgArgs), "warning");
							
							this.setConstraintValue("partiallyWinnable", "forbidden");
						}

						if(this.getConstraintValue("lost") !== "forbidden") {
							let msgArgs = {
								nameA: this.$t('creator.constraints.winnable'),
								valueA: this.$t('creator.constraints.' + value),
								nameB: this.$t('creator.constraints.lost'),
								valueB: this.$t('creator.constraints.' + this.getConstraintValue("lost"))
							}
							this.showMessage(this.$t('creator.messages.incompatibleConstraints', msgArgs), "warning");
							
							this.setConstraintValue("lost", "forbidden");
						}

						if(this.getConstraintValue("partiallyLost") !== "forbidden") {
							let msgArgs = {
								nameA: this.$t('creator.constraints.winnable'),
								valueA: this.$t('creator.constraints.' + value),
								nameB: this.$t('creator.constraints.partiallyLost'),
								valueB: this.$t('creator.constraints.' + this.getConstraintValue("partiallyLost"))
							}
							this.showMessage(this.$t('creator.messages.incompatibleConstraints', msgArgs), "warning");
							
							this.setConstraintValue("partiallyLost", "forbidden");
						}

						if (this.getConstraintValue("survivable") !== "required") {
							let msgArgs = {
								nameA: this.$t('creator.constraints.winnable'),
								valueA: this.$t('creator.constraints.' + value),
								nameB: this.$t('creator.constraints.survivable'),
								valueB: this.$t('creator.constraints.' + this.getConstraintValue("survivable"))
							}
							this.showMessage(this.$t('creator.messages.incompatibleConstraints', msgArgs), "warning");
							
							this.setConstraintValue("survivable", "required");
						}

						if (this.getConstraintValue("partiallySurvivable") !== "forbidden") {
							let msgArgs = {
								nameA: this.$t('creator.constraints.winnable'),
								valueA: this.$t('creator.constraints.' + value),
								nameB: this.$t('creator.constraints.partiallySurvivable'),
								valueB: this.$t('creator.constraints.' + this.getConstraintValue("partiallySurvivable"))
							}
							this.showMessage(this.$t('creator.messages.incompatibleConstraints', msgArgs), "warning");
							
							this.setConstraintValue("partiallySurvivable", "forbidden");
						}
					}
					break;

				case "partiallyWinnable":
					if (value === "required") {
						if (this.goals === 0) {
							let msgArgs = {
								constraint: this.$t('creator.constraints.partiallyWinnable'),
								nGoals: 1
							};
							this.showMessage(this.$t('creator.messages.minimumGoals', msgArgs), "warning");
							
							this.goals = 1;
						}

						if(this.getConstraintValue("winnable") !== "forbidden") {
							let msgArgs = {
								nameA: this.$t('creator.constraints.partiallyWinnable'),
								valueA: this.$t('creator.constraints.' + value),
								nameB: this.$t('creator.constraints.winnable'),
								valueB: this.$t('creator.constraints.' + this.getConstraintValue("winnable"))
							}
							this.showMessage(this.$t('creator.messages.incompatibleConstraints', msgArgs), "warning");
							
							this.setConstraintValue("winnable", "forbidden");
						}

						if(this.getConstraintValue("lost") !== "forbidden") {
							let msgArgs = {
								nameA: this.$t('creator.constraints.partiallyWinnable'),
								valueA: this.$t('creator.constraints.' + value),
								nameB: this.$t('creator.constraints.lost'),
								valueB: this.$t('creator.constraints.' + this.getConstraintValue("lost"))
							}
							this.showMessage(this.$t('creator.messages.incompatibleConstraints', msgArgs), "warning");
							
							this.setConstraintValue("lost", "forbidden");
						}
					}
					break;

				case "survivable":
					if (value === "required") {
						if (this.goals === 0) {
							let msgArgs = {
								constraint: this.$t('creator.constraints.survivable'),
								nGoals: 1
							};
							this.showMessage(this.$t('creator.messages.minimumGoals', msgArgs), "warning");
							
							this.goals = 1;
						}

						if(this.getConstraintValue("partiallySurvivable") !== "forbidden") {
							let msgArgs = {
								nameA: this.$t('creator.constraints.survivable'),
								valueA: this.$t('creator.constraints.' + value),
								nameB: this.$t('creator.constraints.partiallySurvivable'),
								valueB: this.$t('creator.constraints.' + this.getConstraintValue("partiallySurvivable"))
							}
							this.showMessage(this.$t('creator.messages.incompatibleConstraints', msgArgs), "warning");
							
							this.setConstraintValue("partiallySurvivable", "forbidden");
						}
					}
					break;

				case "partiallySurvivable":
					if (value === "required") {
						if (this.goals === 0) {
							let msgArgs = {
								constraint: this.$t('creator.constraints.partiallySurvivable'),
								nGoals: 1
							};
							this.showMessage(this.$t('creator.messages.minimumGoals', msgArgs), "warning");
							
							this.goals = 1;
						}

						if(this.getConstraintValue("survivable") !== "forbidden") {
							let msgArgs = {
								nameA: this.$t('creator.constraints.partiallySurvivable'),
								valueA: this.$t('creator.constraints.' + value),
								nameB: this.$t('creator.constraints.survivable'),
								valueB: this.$t('creator.constraints.' + this.getConstraintValue("survivable"))
							}
							this.showMessage(this.$t('creator.messages.incompatibleConstraints', msgArgs), "warning");
							
							this.setConstraintValue("survivable", "forbidden");
						}
					}
					break;

				case "lost":
					if (value === "required") {
						if (this.traps === 0) {
							let msgArgs = {
								constraint: this.$t('creator.constraints.lost'),
								nTraps: 1
							};
							this.showMessage(this.$t('creator.messages.minimumTraps', msgArgs), "warning");
							
							this.traps = 1;
						}

						if(this.getConstraintValue("partiallyLost") !== "forbidden") {
							let msgArgs = {
								nameA: this.$t('creator.constraints.lost'),
								valueA: this.$t('creator.constraints.' + value),
								nameB: this.$t('creator.constraints.partiallyLost'),
								valueB: this.$t('creator.constraints.' + this.getConstraintValue("partiallyLost"))
							}
							this.showMessage(this.$t('creator.messages.incompatibleConstraints', msgArgs), "warning");
							
							this.setConstraintValue("partiallyLost", "forbidden");
						}

						if(this.getConstraintValue("winnable") !== "forbidden") {
							let msgArgs = {
								nameA: this.$t('creator.constraints.lost'),
								valueA: this.$t('creator.constraints.' + value),
								nameB: this.$t('creator.constraints.winnable'),
								valueB: this.$t('creator.constraints.' + this.getConstraintValue("winnable"))
							}
							this.showMessage(this.$t('creator.messages.incompatibleConstraints', msgArgs), "warning");
							
							this.setConstraintValue("winnable", "forbidden");
						}

						if(this.getConstraintValue("partiallyWinnable") !== "forbidden") {
							let msgArgs = {
								nameA: this.$t('creator.constraints.lost'),
								valueA: this.$t('creator.constraints.' + value),
								nameB: this.$t('creator.constraints.partiallyWinnable'),
								valueB: this.$t('creator.constraints.' + this.getConstraintValue("partiallyWinnable"))
							}
							this.showMessage(this.$t('creator.messages.incompatibleConstraints', msgArgs), "warning");
							
							this.setConstraintValue("partiallyWinnable", "forbidden");
						}

						if (this.store.state.stepCost < 0.01) {
							let msgArgs = {
								constraint: this.$t('creator.constraints.lost')
							};
							this.showMessage(this.$t('creator.messages.minimumStepCost', msgArgs), "warning")
							this.setConstraintValue("lost", "optional");
						}
					}
					break;

				case "partiallyLost":
					if (value === "required") {
						if (this.traps === 0) {
							let msgArgs = {
								constraint: this.$t('creator.constraints.partiallyLost'),
								nTraps: 1
							};
							this.showMessage(this.$t('creator.messages.minimumTraps', msgArgs), "warning");
							
							this.traps = 1;
						}

						if(this.getConstraintValue("lost") !== "forbidden") {
							let msgArgs = {
								nameA: this.$t('creator.constraints.partiallyLost'),
								valueA: this.$t('creator.constraints.' + value),
								nameB: this.$t('creator.constraints.lost'),
								valueB: this.$t('creator.constraints.' + this.getConstraintValue("lost"))
							}
							this.showMessage(this.$t('creator.messages.incompatibleConstraints', msgArgs), "warning");
							
							this.setConstraintValue("lost", "forbidden");
						}

						if(this.getConstraintValue("winnable") !== "forbidden") {
							let msgArgs = {
								nameA: this.$t('creator.constraints.partiallyLost'),
								valueA: this.$t('creator.constraints.' + value),
								nameB: this.$t('creator.constraints.winnable'),
								valueB: this.$t('creator.constraints.' + this.getConstraintValue("winnable"))
							}
							this.showMessage(this.$t('creator.messages.incompatibleConstraints', msgArgs), "warning");
							
							this.setConstraintValue("winnable", "forbidden");
						}

						if (this.store.state.stepCost < 0.01) {
							let msgArgs = {
								constraint: this.$t('creator.constraints.partiallyLost')
							};
							this.showMessage(this.$t('creator.messages.minimumStepCost', msgArgs), "warning");
							this.setConstraintValue("partiallyLost", "optional");
						}
					}
					break;

				case "unambiguous":
					if (value === "forbidden" && this.getConstraintValue("trivial") !== "forbidden") {
						let msgArgs = {
								nameA: this.$t('creator.constraints.unambiguous'),
								valueA: this.$t('creator.constraints.' + value),
								nameB: this.$t('creator.constraints.trivial'),
								valueB: this.$t('creator.constraints.' + this.getConstraintValue("trivial"))
							}
							this.showMessage(this.$t('creator.messages.incompatibleConstraints', msgArgs), "warning");
							
							this.setConstraintValue("trivial", "forbidden");
					}
					break;

				case "trivial":
					if (value === "required" && this.getConstraintValue("unambiguous") !== "required") {
						let msgArgs = {
								nameA: this.$t('creator.constraints.trivial'),
								valueA: this.$t('creator.constraints.' + value),
								nameB: this.$t('creator.constraints.unambiguous'),
								valueB: this.$t('creator.constraints.' + this.getConstraintValue("unambiguous"))
							}
							this.showMessage(this.$t('creator.messages.incompatibleConstraints', msgArgs), "warning");
							
							this.setConstraintValue("unambiguous", "required");
					}
					break;
			
				default:
					break;
			}
		},

		setConstraintValue(key, value) {
			this.$refs[key].value = value;
		},

		getConstraintValue(key) {
			return this.$refs[key]? this.$refs[key].value : this.constraints[key];
		},

		showMessage(text, color, timeout=10000) {
			this.msgText = text;
			this.msgColor = color;
			this.msgTimeout = timeout;
			this.message = true;
		},

		scrollHandler(event, attribute, min=0, max=50) {
			if(event.deltaY > 0) {
				this[attribute] = Math.min(max, Math.max(min, this[attribute] - 1));
			} else {
				this[attribute] = Math.min(max, Math.max(min, this[attribute] + 1));
			}
		},
		
		noHandler() {},
		
		requirements() {
			let reqs = new Requirements();
			reqs.width = this.width;
			reqs.height = this.height;
			reqs.goals = this.goals;
			reqs.traps = this.traps;

			switch (this.generator) {
				case "perfect":
					reqs.carver = carveDFS;
					break;
			
				case "braid":
					reqs.carver = carveKruskal;
					reqs.braid = true;
					break;

				case "unicursal":
					reqs.carver = carveUnicursal;
					break;

				case "erdos":
					reqs.carver = carveErdosReny;
					reqs.carverArgs.probability = 0.2;
					break;

				case "white":
					reqs.carver = carveNoise;
					reqs.carverArgs = {
						width: this.width,
						height: this.height,
						generator: "white",
						bias: 0.5
					};
					break;

				case "whiteBlur":
					reqs.carver = carveNoise;
					reqs.carverArgs = {
						width: this.width,
						height: this.height,
						generator: "white",
						bias: 0.5,
						blur: true,
						kernel: "gaus3"
					};
					break;

				case "perlin":
					reqs.carver = carveNoise;
					reqs.carverArgs = {
						width: this.width,
						height: this.height,
						generator: "perlin",
						bias: 0.5,
						frequency: 4
					};
					break;

				case "fractal":
					reqs.carver = carveNoise;
					reqs.carverArgs = {
						width: this.width,
						height: this.height,
						generator: "perlin",
						frequency: 4,
						bias: 0.5,
						fractal: true,
						octaves: 4,
						amplitude: 1,
						fractalFrequency: 1,
						persistence: 0.8
					};
					break;

				default:
					reqs.carver = carveKruskal;
					break;
			}

			// reqs.carver = this.algTable[this.selectedAlgorithm];
			// reqs.braid = this.braid;
			// reqs.carverArgs.width = this.width;
			// reqs.carverArgs.height = this.height;
			// reqs.carverArgs.bias = this.bias;
			// reqs.carverArgs.generator = this.noiseGen;
			// reqs.carverArgs.blur = this.blur;
			// reqs.carverArgs.kernel = this.selectedKernel;
			// reqs.carverArgs.frequency = this.frequency;
			// reqs.carverArgs.fractal = this.fractal;
			// reqs.carverArgs.octaves = this.octaves;
			// reqs.carverArgs.fractalFrequency = this.fractalFrequency;
			// reqs.carverArgs.amplitude = 1;
			// reqs.carverArgs.persistence = this.persistence;


			for (const key in this.constraints) {
				reqs[key] = this.getConstraintValue(key);
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
			// reqs.unambiguousPolicy = this.$refs["unambiguousPolicy"]?this.$refs["unambiguousPolicy"].value:this.constraints.unambiguousPolicy;
			// reqs.trivial = this.$refs["trivial"]?this.$refs["trivial"].value:this.constraints.trivial;

			reqs.reset();
			return reqs;
		}
	},

	computed: {
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
		min-width: 500px;
	}

	#generatorSelect {
		flex-direction:column;
		width: 100%;
	}

	#sizeSeperator {
		margin-left: 16px;
		margin-right: 16px
	}
</style>