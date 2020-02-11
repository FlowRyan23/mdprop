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
		<v-slider v-model="settings.stepCost" :step="0.01" :max="1" :min="0" :label="'Step Cost'" hide-details>
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

		<v-btn :name="'step-cost'" @click="reset()">Reset</v-btn>
		<v-btn :name="'apply'" @click="apply()">Apply</v-btn>

		<!-- detail toggle -->
		<v-switch label="High Detail" v-model="settings.detailedDisplay" @click.passive="apply()" color="blue"></v-switch>
		<v-switch label="Use Rounded" v-model="settings.useRounded" @click.passive="apply()" color="blue"></v-switch>
	</div>
</template>

<script>
import store from '../logic/sharedData'
import {sleep} from '../logic/util'

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
		}
	},

	mounted() {
		this.reset();
	}
}
</script>