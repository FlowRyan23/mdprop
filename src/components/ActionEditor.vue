<template>
	<v-col id="conatiner">
		<!-- Formula -->
		<p>{{action.getFormula()}}</p>

		<div v-if="store.state.settings.enableAdvancedSettings">
			<!-- Reward slider-->
			<v-slider v-model="action.reward" :step="0.01" :max="1.0" :min="-1.0" :label="'Reward'" hide-details>
				<template v-slot:append>
					<v-text-field
						v-model="action.reward"
						class="mt-0 pt-0"
						hide-details
						single-line
						type="number"
						style="width: 60px"
					></v-text-field>
				</template>
			</v-slider>

			<!-- Discount slider-->
			<v-slider v-model="action.discount" :step="0.01" :max="1.0" :min="-1.0" :label="'Discount'" hide-details>
				<template v-slot:append>
					<v-text-field
						v-model="action.discount"
						class="mt-0 pt-0"
						hide-details
						single-line
						type="number"
						style="width: 60px"
					></v-text-field>
				</template>
			</v-slider>

			<!-- Cost slider-->
			<v-slider v-model="action.cost" :step="0.01" :max="1.0" :min="0" :label="'Cost'" hide-details>
				<template v-slot:append>
					<v-text-field
						v-model="action.cost"
						class="mt-0 pt-0"
						hide-details
						single-line
						type="number"
						style="width: 60px"
					></v-text-field>
				</template>
			</v-slider>

		</div>
	</v-col>
</template>

<script>
import store from '../logic/sharedData';
export default {
	props: ["action"],
	data() {return {
		store: store
	}}
}
</script>

<style scoped>
	#container {
		padding: 0
	}
</style>