<template>
	<div class="col">
		<h2>Settings</h2>
		<!-- Discount slider -->
		<v-slider v-model="discount" :step="0.01" :max="1" :min="0" :label="'Discount'" hide-details @change="setDiscount">
			<template v-slot:append>
				<v-text-field
					v-model="discount"
					class="mt-0 pt-0 no-spins"
					hide-details
					single-line
					type="number"
					style="width: 60px"
					@change="setDiscount"
				></v-text-field>
			</template>
		</v-slider>

		<!-- step cost slider -->
		<v-slider v-model="stepCost" :step="0.01" :max="5" :min="0" :label="'Step Cost'" hide-details @change="setStepCost">
			<template v-slot:append>
				<v-text-field
					v-model="stepCost"
					class="mt-0 pt-0 no-spins"
					hide-details
					single-line
					type="number"
					style="width: 60px"
					@change="setStepCost"
				></v-text-field>
			</template>
		</v-slider>

		<div class="d-flex" style="justify-content: space-between; margin-top: 16px">
			<p style="margin-top:16px">Step Chances</p>
			<v-btn plain fab @click="expandStepChances = !expandStepChances">
				<v-icon v-if="expandStepChances">mdi-chevron-up</v-icon>
				<v-icon v-else>mdi-chevron-down</v-icon>
			</v-btn>
		</div>

		<div v-if="expandStepChances">
			<!-- StepChanceFront -->
			<v-slider v-model="stepChances.front" :step="0.01" :max="1" :min="0" :label="'Front'" hide-details @change="setStepChances">
				<template v-slot:append>
					<v-text-field
						v-model="stepChances.front"
						class="mt-0 pt-0 no-spins"
						hide-details
						single-line
						type="number"
						style="width: 60px"
						@change="setStepChances"
					></v-text-field>
				</template>
			</v-slider>

			<!-- StepChanceLeft -->
			<v-slider v-model="stepChances.left" :step="0.01" :max="1" :min="0" :label="'Left'" hide-details @change="setStepChances">
				<template v-slot:append>
					<v-text-field
						v-model="stepChances.left"
						class="mt-0 pt-0 no-spins"
						hide-details
						single-line
						type="number"
						style="width: 60px"
						@change="setStepChances"
					></v-text-field>
				</template>
			</v-slider>

			<!-- StepChanceRight -->
			<v-slider v-model="stepChances.right" :step="0.01" :max="1" :min="0" :label="'Right'" hide-details @change="setStepChances">
				<template v-slot:append>
					<v-text-field
						v-model="stepChances.right"
						class="mt-0 pt-0 no-spins"
						hide-details
						single-line
						type="number"
						style="width: 60px"
						@change="setStepChances"
					></v-text-field>
				</template>
			</v-slider>

			<!-- StepChanceBack -->
			<v-slider v-model="stepChances.back" :step="0.01" :max="1" :min="0" :label="'Back'" hide-details @change="setStepChances">
				<template v-slot:append>
					<v-text-field
						v-model="stepChances.back"
						class="mt-0 pt-0 no-spins"
						hide-details
						single-line
						type="number"
						style="width: 60px"
						@change="setStepChances"
					></v-text-field>
				</template>
			</v-slider>
		</div>

		<v-slider v-else v-model="noise" :step="0.01" :max="1" :min="0" :label="'Noise'" hide-details @change="setStepChances">
			<template v-slot:append>
				<v-text-field
					v-model="noise"
					class="mt-0 pt-0 no-spins"
					hide-details
					single-line
					type="number"
					style="width: 60px"
					@change="setStepChances"
				></v-text-field>
			</template>
		</v-slider>

		<p v-if="stepChanceSum !== 1" style="color: red">Step chances should sum to 1.00</p>

		<div class="d-flex" style="justify-content: space-between; margin-top: 16px">
			<p style="margin-top:16px">UI</p>
			<v-btn plain fab @click="expandTileSizes = !expandTileSizes">
				<v-icon v-if="expandTileSizes">mdi-chevron-up</v-icon>
				<v-icon v-else>mdi-chevron-down</v-icon>
			</v-btn>
		</div>

		<div v-if="expandTileSizes">
			<!-- tile width slider -->
			<v-slider v-model="tileWidth" :step="1" :max="512" :min="1" :label="'Tile Width'" hide-details @change="setTileSizes">
				<template v-slot:append>
					<v-text-field
						v-model="tileWidth"
						class="mt-0 pt-0" hide-details
						single-line	type="number" style="width: 60px"
						@change="setTileSizes"
					></v-text-field>
				</template>
			</v-slider>

			<!-- tile height slider -->
			<v-slider v-model="tileHeight" :step="1" :max="512" :min="1" :label="'Tile Height'" hide-details @change="setTileSizes">
				<template v-slot:append>
					<v-text-field
						v-model="tileHeight"
						class="mt-0 pt-0" hide-details
						single-line	type="number" style="width: 60px"
						@change="setTileSizes"
					></v-text-field>
				</template>
			</v-slider>
		</div>

		<div v-else>
			<!-- zoom slider -->
			<v-slider v-model="zoom" :step="5" :max="500" :min="5" :label="'Zoom'" hide-details @change="setTileSizes">
				<template v-slot:append>
					<v-text-field
						v-model="zoom"
						class="mt-0 pt-0" hide-details
						single-line	type="number" style="width: 60px"
						@change="setTileSizes"
					></v-text-field>
				</template>
			</v-slider>
		</div>

		<!-- detail toggle -->
		<v-switch label="Use Rounded" v-model="useRounded" @change="store.commit('toggleRounded')" color="blue"></v-switch>
		<v-switch label="Dark Mode" v-model="$vuetify.theme.dark" color="blue"></v-switch>

		<v-btn @click="reset()">Reset</v-btn>

	</div>
</template>

<script>
import store from '../logic/sharedData';

export default {
	name: "Settings",
	data() {return {
		store: store,
		discount: store.state.discount,
		stepCost: store.state.stepCost,
		stepChances: {
			front: store.state.scFront,
			back: store.state.scBack,
			left: store.state.scLeft,
			right: store.state.scRight
		},
		tileWidth: store.state.tileWidth,
		tileHeight: store.state.tileHeight,
		useRounded: store.state.useRounded,
		noise: 0.2,
		zoom: 100,
		expandStepChances: false,
		expandTileSizes: false,
		test: null
	}},

	methods: {
		setDiscount() {
			store.commit('setDiscount', this.discount);
			this.$emit('apply-settings');
		},

		setStepCost() {
			store.commit('setStepCost', this.stepCost);
			this.$emit('apply-settings');
		},

		setStepChances() {
			if (!this.expandStepChances) {
				this.stepChances.front = 1 - this.noise;
				this.stepChances.back = 0;
				this.stepChances.left = this.noise / 2;
				this.stepChances.right = this.noise / 2;
			}
			store.commit('setStepChances', {...this.stepChances});
			this.$emit('apply-settings');
		},

		setTileSizes() {
			if (!this.expandTileSizes) {
				if (this.tileWidth > this.tileHeight) {
					this.tileHeight = this.zoom * this.tileHeight/this.tileWidth;
					this.tileWidth = this.zoom;
				} else {
					this.tileWidth = this.zoom * this.tileWidth/this.tileHeight;
					this.tileHeight = this.zoom;
				}	
			}
			store.commit('setTileSizes', {width: this.tileWidth, height: this.tileHeight});
			this.$emit('redraw');
		},

		scrollHandler(event, attribute, min=0, max=200, step) {
			if(event.deltaY > 0) {
				this[attribute] = Math.min(max, Math.max(min, this[attribute] - step));
			} else {
				this[attribute] = Math.min(max, Math.max(min, this[attribute] + step));
			}
		},

		reset() {
			this.discount = 0.9;
			this.setDiscount();
			this.stepCost = 0;
			this.setStepCost();

			this.stepChances.front = 0.8;
			this.stepChances.left = 0.1;
			this.stepChances.right = 0.1;
			this.stepChances.back = 0.0;
			this.noise = 0.2;
			this.setStepChances();

			this.tileWidth = 100;
			this.tileHeight = 100;
			this.zoom = 100;
			this.setTileSizes();

			this.useRounded = true;
			if (!store.state.useRounded) {
				store.commit('toggleRounded');
			}

		}
	},

	computed: {
		stepChanceSum() {
			if(this.expandStepChances) {
				return this.stepChances.front + this.stepChances.back + this.stepChances.left + this.stepChances.right;
			} else return 1;
		}
	},

	created () {
		this.$vuetify.theme.dark = true;
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
</style>