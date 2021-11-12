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

		<p style="margin-top: 16px">UI</p>

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

		<v-btn :name="'reset'" @click="reset()" style="margin-top: 16px">Reset</v-btn>
		<v-btn :name="'apply'" @click="apply()" style="margin-top: 16px">Apply</v-btn>

		<!-- detail toggle -->
		<v-switch label="High Detail" v-model="settings.detailedDisplay" @click.passive="apply()" color="blue"></v-switch>
		<v-switch label="Use Rounded" v-model="settings.useRounded" @click.passive="apply()" color="blue"></v-switch>
		<v-switch label="Advanced Mode" v-model="settings.enableAdvancedSettings" @click.passive="apply()" color="blue"></v-switch>

		<v-btn :name="'download'" @click="dload('test.txt', 'Hello World')">download</v-btn>

	</div>
</template>

<script>
import store from '../logic/sharedData'
import {sleep, download} from '../logic/util'

export default {
	name: "GridMDPSettings",
	data() {return {
		settings: {...store.state.settings}
	}},

	methods: {
		apply() {
			store.commit("setSettings", {...this.settings});
			sleep(0).then(() => {
				this.$emit('apply-settings');
			});
		},

		reset() {
			this.settings = {...store.state.defaultSettings};
		},

		dload(filename, text) {
			download(filename, text)
		}
	},

	mounted() {
		this.reset();
	}
}
</script>