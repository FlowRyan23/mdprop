<template>
	<v-col>
		<!-- Formula -->
		<v-tooltip bottom>
			<template v-slot:activator="{on}">
				<span>{{action.discount}} * (</span>
			</template>
			<span>discount</span>
		</v-tooltip>
		<span :key="i" v-for="(res, i) in action.results">
			<v-tooltip bottom>
				<template v-slot:activator="{on}">
					<span>{{res.chance}} *</span>
				</template>
				<span>chance</span>
			</v-tooltip>

			<v-tooltip bottom>
				<template v-slot:activator="{on}">
					<span>{{res.node.getQValue(store.state.displayIteration).toFixed(2)}} + </span>
				</template>
				<span>chance</span>
			</v-tooltip>
		</span>
		<v-tooltip bottom>
			<template v-slot:activator="{on}">
				<span> - {{action.cost}})</span>
			</template>
			<span>discount</span>
		</v-tooltip>

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