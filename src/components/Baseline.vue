<template>
	<div>
		<v-navigation-drawer id="nav-drawer" v-model="drawer" app clipped floating mobile-breakpoint="1200">
			<GridMDPSettings id="settings" @apply-settings="applySettings()"/>
		</v-navigation-drawer>

		<v-app-bar app clipped-left>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer" />
			<v-toolbar-title>MDP Q-Value-Propagation</v-toolbar-title>
		</v-app-bar>

		<v-main>	
			<GridMDP id="gmdp" ref="gmdp" />
		</v-main>

		<v-footer app>
		</v-footer>
	</div>
</template>

<script>
import GridMDP from "./GridMDP.vue";
import GridMDPSettings from "./GridMDPSettings.vue";

export default {
	name: 'Baseline',
	components: {GridMDPSettings, GridMDP},
	props: {source: String},

	data() {return {
		drawer: null
	}},

	methods: {
		applySettings() {
			this.$refs["gmdp"].applySettings();
		}
	}
}
</script>

<style scoped>
	#nav-drawer {
		min-width: 400px;
	}
</style>