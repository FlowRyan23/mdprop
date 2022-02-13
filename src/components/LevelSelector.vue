<template>
	<v-overlay>
		<v-card>
			<div v-if="worlds">
				<div :key="x" v-for="(level, x) of worlds" id="container">
					<grid-mdp-display :level="level"/>
				</div>
			</div>
		</v-card>
	</v-overlay>
</template>

<script>
import GridMDPDisplay from './GridMDPDisplay.vue'
export default {
  components: { GridMDPDisplay },
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