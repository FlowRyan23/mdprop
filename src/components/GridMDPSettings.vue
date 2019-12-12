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

		<v-btn :name="'step-cost'" @click="reset()">Reset</v-btn>
		<v-btn :name="'apply'" @click="apply()">Apply</v-btn>
	</div>
</template>

<script>
import store from '../logic/settings'
export default {
	name: "GridMDPSettings",
	data() {return {
		settings: {...store.state.ssettings}
	}},

	methods: {
		apply() {
			store.commit("setSettings", {...this.settings});
			this.$emit('apply-settings');
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