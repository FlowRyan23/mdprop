<template>
	<v-overlay :value="true">
		<v-card id="card">
			<div id="buttons" class="d-flex">
				<v-text-field
					label="Iteration"
					v-model="iteration"
					min="1"
					class="mt-0 pt-0"
					type="number"
					outlined
				></v-text-field>

				<v-btn class="spaced" :name="'download'" @click="save()">download</v-btn>
				<v-btn class="spaced" :name="'back'" @click="store.commit('displayMDP')">back</v-btn>
			</div>
			
			<div>
				<p id="text">{{this.getSolutionTxt()}}</p>
			</div>
		</v-card>
	</v-overlay>
</template>

<script>
import store from '../logic/sharedData';
import {download} from '../logic/util';

export default {
	props: ["mdp"],

	data() {return {
		store: store,
		iteration: store.state.displayIteration,
		filename: "solution"
	}},

	methods: {
		save()  {
			download(this.filename + ".txt", this.getSolutionTxt());
			store.commit("displayMDP");
		},

		getSolutionTxt() {
			return this.mdp.getSolution(this.iteration);
		}
	}
}
</script>

<style scoped>
	#text {
		white-space: pre-wrap;
	}

	#card  {
		padding: 16px;
		max-height: 800px;
	}

	#text {
		max-height: 650px;
		width: 500px;
		overflow-y: scroll;
	}

	#buttons {
		justify-content: space-between;
	}

	.spaced {
		margin-left: 16px;
	}
</style>