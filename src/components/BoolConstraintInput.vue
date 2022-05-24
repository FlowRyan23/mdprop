<template>
	<v-container>
		<v-row class="no-pad" no-gutters>
			<v-col class="no-pad" cols="7" align-self="center">{{name}}</v-col>
			<v-col class="no-pad" cols="5">
				<v-btn-toggle v-model="value" mandatory aria-disabled>
					<v-btn :value="'required'" :color="value==='required'?'green':null"><v-icon>mdi-check</v-icon></v-btn>
					<v-btn :value="'optional'"></v-btn>
					<v-btn :value="'forbidden'" :color="value==='forbidden'?'red':null"><v-icon>mdi-cancel</v-icon></v-btn>
				</v-btn-toggle>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	props: ["name", "initialValue"],
	data() {return {
		value: this.initialValue
	}}
}
</script>