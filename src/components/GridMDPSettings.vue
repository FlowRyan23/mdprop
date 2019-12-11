<template>
	<div class="myCol">
		<h2>Settings</h2>
		<!-- Discount slider -->
		<v-slider v-model="settings.defaultDiscount" :step="0.01" :max="1" :min="0" :label="'Discount'" hide-details>
			<template v-slot:append>
				<v-text-field
					v-model="settings.defaultDiscount"
					class="mt-0 pt-0"
					hide-details
					single-line
					type="number"
					style="width: 60px"
				></v-text-field>
			</template>
		</v-slider>

		<v-btn :name="'discount'" @click="$emit('reset-setting', 'defaultDiscount')">Reset</v-btn>

		<!-- step cost slider -->
		<v-slider v-model="settings.defaultStepCost" :step="0.01" :max="1" :min="0" :label="'Step Cost'" hide-details>
			<template v-slot:append>
              <v-text-field
                v-model="settings.defaultStepCost"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
              ></v-text-field>
			</template>
		</v-slider>

		<v-btn :name="'step-cost'" @click="$emit('reset-setting', 'defaultStepCost')">Reset</v-btn>
	</div>
</template>

<script>
export default {
	name: "GridMDPSettings",
	props: ['settings']
}
</script>