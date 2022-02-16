<template>
	<div class="col">
		<h2>Settings</h2>
		<!-- Discount slider -->
		<v-slider v-model="settings.discount" :step="0.01" :max="1" :min="0" :label="'Discount'" hide-details>
			<template v-slot:append>
				<v-text-field
					v-model="settings.discount"
					class="mt-0 pt-0"
					hide-details
					single-line
					type="number"
					style="width: 60px"
				></v-text-field>
			</template>
		</v-slider>

		<!-- step cost slider -->
		<v-slider v-model="settings.stepCost" :step="0.01" :max="settings.maxStepCost" :min="0" :label="'Step Cost'" hide-details>
			<template v-slot:append>
				<v-text-field
					v-model="settings.stepCost"
					class="mt-0 pt-0"
					hide-details
					single-line
					type="number"
					style="width: 60px"
				></v-text-field>
			</template>
		</v-slider>

		<p style="margin-top: 16px">Step Chances</p>

		<div v-if="store.state.settings.enableAdvancedSettings">
			<!-- StepChanceFront -->
			<v-slider v-model="settings.scFront" :step="0.01" :max="1" :min="0" :label="'Front'" hide-details>
				<template v-slot:append>
					<v-text-field
						v-model="settings.scFront"
						class="mt-0 pt-0"
						hide-details
						single-line
						type="number"
						style="width: 60px"
					></v-text-field>
				</template>
			</v-slider>

			<!-- StepChanceLeft -->
			<v-slider v-model="settings.scLeft" :step="0.01" :max="1" :min="0" :label="'Left'" hide-details>
				<template v-slot:append>
					<v-text-field
						v-model="settings.scLeft"
						class="mt-0 pt-0"
						hide-details
						single-line
						type="number"
						style="width: 60px"
					></v-text-field>
				</template>
			</v-slider>

			<!-- StepChanceRight -->
			<v-slider v-model="settings.scRight" :step="0.01" :max="1" :min="0" :label="'Right'" hide-details>
				<template v-slot:append>
					<v-text-field
						v-model="settings.scRight"
						class="mt-0 pt-0"
						hide-details
						single-line
						type="number"
						style="width: 60px"
					></v-text-field>
				</template>
			</v-slider>

			<!-- StepChanceBack -->
			<v-slider v-model="settings.scBack" :step="0.01" :max="1" :min="0" :label="'Back'" hide-details>
				<template v-slot:append>
					<v-text-field
						v-model="settings.scBack"
						class="mt-0 pt-0"
						hide-details
						single-line
						type="number"
						style="width: 60px"
					></v-text-field>
				</template>
			</v-slider>
		</div>

		<v-slider v-else v-model="noise" :step="0.01" :max="1" :min="0" :label="'Noise'" hide-details>
			<template v-slot:append>
				<v-text-field
					v-model="noise"
					class="mt-0 pt-0"
					hide-details
					single-line
					type="number"
					style="width: 60px"
				></v-text-field>
			</template>
		</v-slider>

		<p v-if="stepChanceSum !== 1" style="color: red">Step chances should sum to 1.00</p>

		<p style="margin-top: 16px">UI</p>

		<div v-if="store.state.settings.enableAdvancedSettings">
			<!-- tile width slider -->
			<v-slider v-model="settings.tileWidth" :step="1" :max="512" :min="1" :label="'Tile Width'" hide-details>
				<template v-slot:append>
					<v-text-field
						v-model="settings.tileWidth"
						class="mt-0 pt-0" hide-details
						single-line	type="number" style="width: 60px"
					></v-text-field>
				</template>
			</v-slider>

			<!-- tile height slider -->
			<v-slider v-model="settings.tileHeight" :step="1" :max="512" :min="1" :label="'Tile Height'" hide-details>
				<template v-slot:append>
					<v-text-field
						v-model="settings.tileHeight"
						class="mt-0 pt-0" hide-details
						single-line	type="number" style="width: 60px"
					></v-text-field>
				</template>
			</v-slider>
		</div>

		<div v-else>
			<!-- zoom slider -->
			<v-slider v-model="zoom" :step="5" :max="500" :min="5" :label="'Zoom'" hide-details>
				<template v-slot:append>
					<v-text-field
						v-model="zoom"
						class="mt-0 pt-0" hide-details
						single-line	type="number" style="width: 60px"
					></v-text-field>
				</template>
			</v-slider>
		</div>


		<v-btn :name="'reset'" @click="reset()" style="margin-top: 16px">Reset</v-btn>
		<v-btn :name="'apply'" @click="apply()" style="margin-top: 16px">Apply</v-btn>

		<!-- detail toggle -->
		<v-switch label="High Detail" v-model="settings.detailedDisplay" @click.passive="apply()" color="blue"></v-switch>
		<v-switch label="Use Rounded" v-model="settings.useRounded" @click.passive="apply()" color="blue"></v-switch>
		<v-switch label="Advanced Mode" v-model="settings.enableAdvancedSettings" @click.passive="apply()" color="blue"></v-switch>
		<v-switch label="Dark Mode" v-model="$vuetify.theme.dark" color="blue"></v-switch>

	</div>
</template>

<script>
import store from '../logic/sharedData'
import {sleep} from '../logic/util'

export default {
	name: "Settings",
	data() {return {
		settings: {...store.state.defaultSettings},
		noise: 0.2,
		zoom: 100,
		store: store
	}},

	methods: {
		apply() {
			if(!this.store.state.settings.enableAdvancedSettings) {
				this.settings.scFront = 1 - this.noise;
				this.settings.scBack = 0;
				this.settings.scLeft = this.noise / 2;
				this.settings.scRight = this.noise / 2;

				this.settings.tileWidth = this.zoom;
				this.settings.tileHeight = this.zoom;
			}
			store.commit("setSettings", {...this.settings});
			sleep(0).then(() => {
				this.$emit('apply-settings');
			});
		},

		reset() {
			//todo fix the toggles
			let hDetailToggle = this.settings.detailedDisplay;
			let roundedToggle = this.settings.useRounded;
			let advancedToggle = this.settings.enableAdvancedSettings;
			this.settings = {...store.state.defaultSettings};
			this.settings.detailedDisplay = hDetailToggle;
			this.settings.useRounded = roundedToggle;
			this.settings.enableAdvancedSettings = advancedToggle;
			this.apply();
		}
	},

	computed: {
		stepChanceSum() {
			if(this.store.state.settings.enableAdvancedSettings) {
				return this.settings.scFront + this.settings.scBack + this.settings.scLeft + this.settings.scRight;
			} else return 1;
		}
	},

	mounted() {
		this.reset();
		this.settings.useRounded = true; // because reset is dirty
	},

	created () {
		this.$vuetify.theme.dark = true;
	}
}
</script>