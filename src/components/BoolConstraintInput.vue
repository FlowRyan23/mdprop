<template>
	<v-container>
		<v-row class="no-pad" no-gutters>
			<v-col class="no-pad" cols="7" align-self="center">{{name}}</v-col>
			<v-col class="no-pad" cols="5">
				<v-btn-toggle v-model="boolValue" mandatory aria-disabled>
					<v-btn :value="true" :color="value===true?'green':null"><v-icon>mdi-check</v-icon></v-btn>
					<v-btn :value="'optional'"></v-btn>
					<v-btn :value="false" :color="value===false?'red':null"><v-icon>mdi-cancel</v-icon></v-btn>
				</v-btn-toggle>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	props: ["name"],
	data() {return {
		boolValue: "optional"
	}},
	computed: {
		value() {
			if (this.boolValue === true) return true;
			else if (this.boolValue === false) return false;
			else return null;
		}
	}
}
</script>