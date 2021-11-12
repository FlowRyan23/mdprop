<template>
	<v-overlay :value="true">
		<v-card id="card">
			<vue-number-input v-model="iteration" :min="1" inline controls center type="number"></vue-number-input>

			<p id="text">{{this.getSolutionTxt()}}</p>
			
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
		iteration: 1,
		filename: "solution"
	}},

	methods: {
		save()  {
			download(this.filename + ".txt", this.getSolutionTxt())
		},

		getSolutionTxt() {
			// todo
			return this.mdp.tiles[0][0].getFormula();
		}
	}
}
</script>

<style scoped>
	#text {
		white-space: pre-wrap;
	}
</style>