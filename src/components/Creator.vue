<template>
	<v-overlay :value="true">
		<v-card>
			<div id="card" class="myCol">
				<h2>Create new Level</h2>

				<div id="size" class="myRow">
					<v-text-field
						label="Width"
						placeholder="Width"
						v-model="width"
						min="1"
						:max="maxWidth"
						class="mt-0 pt-0"
						type="number"
						style="width: 60px"
					></v-text-field>

					<p id="sizeSeperator">x</p>

					<v-text-field
						label="Height"
						placeholder="Height"
						v-model="height"
						min="1"
						class="mt-0 pt-0"
						type="number"
						style="width: 60px"
					></v-text-field>
				</div>

				<v-slider v-model="connectivity" :step="0.01" :max="1" :min="0" :label="'Con'" hide-details>
					<template v-slot:append>
						<v-text-field
							v-model="connectivity"
							class="mt-0 pt-0"
							hide-details
							single-line
							type="number"
							style="width: 60px"
						></v-text-field>
					</template>
				</v-slider>

				<v-btn @click="$parent.create(width, height, connectivity)">create</v-btn>
			</div>
		</v-card>
	</v-overlay>
</template>

<script>
import store from '../logic/sharedData';

export default {
	data() {return {
		width: 31,
		height: 31,
		connectivity: 0.3
	}},

	computed: {
		maxWidth() {
			return store.state.settings.maxWidth;
		}
	}
}
</script>

<style scoped>
	* {
		margin-bottom: 8px
	}
	
	#card {
		padding: 16px
	}

	#sizeSeperator {
		margin-left: 8px;
		margin-right: 8px
	}
</style>