<template>
  <div id="app">
	<GridMDP />
  </div>
</template>

<script>
import GridMDP from './components/GridMDP.vue'

export default {
  name: 'app',
  components: {
    GridMDP
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
