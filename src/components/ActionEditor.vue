<template>
	<v-col id="conatiner">
		<!-- Formula -->
		<p v-if="store.state.enableActionEditing">{{formula()}}</p>
		<p v-else>{{$t('action.' + action.name) + ": " + formula()}}</p>

		<div v-if="store.state.enableActionEditing">
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
	}},
	methods: {
		formula() {
			let tile = this.$parent.$parent.tile;
			let now = store.state.displayIteration;

			if (!tile.reachedAt(now-1) || now===0) {
				return "0 (" + this.$t('action.noFormula') + ")";
			} else {
				return this.action.getFormula(store.state.displayIteration);
			}
		}
	}
}
</script>

<style scoped>
	#container {
		padding: 0
	}
</style>