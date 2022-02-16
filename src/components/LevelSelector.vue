<template>
	<v-overlay>
		<v-card>
			<div v-if="worlds">
				<div :key="x" v-for="(level, x) of worlds" id="container">
					<Display :level="level"/>
				</div>
			</div>
		</v-card>
	</v-overlay>
</template>

<script>
import Display from './Display.vue'
export default {
  components: { Display },
	name: "LevelSelector",
	data()  {return {
		worlds: null
	}},

}
</script>

<style scoped>
	#container {
		display: flex;
		flex-wrap: wrap;
	}
</style>