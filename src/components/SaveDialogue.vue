<template>
  <v-overlay>
    <v-card id="card" class="d-flex flex-column">
      <div class="d-flex justify-space-between">
        <h2 id="headline">{{ $t("saver.title") }}</h2>
        <v-btn @click="store.commit('displayMDP')" rounded icon>
          <v-icon>mdi-close-thick</v-icon>
        </v-btn>
      </div>

      <div class="d-flex">
        <v-text-field
          name="worldName"
          :label="$t('saver.nameInput')"
					:placeholder="$t('saver.namePlaceholder')"
					type="text"
					autofocus
					outlined
          v-model="name"
					style="margin-right: 16px"
        ></v-text-field>

        <v-btn color="blue" @click="save()" style="margin-top: 8px">{{ $t("saver.confirm") }}</v-btn>
      </div>
    </v-card>
  </v-overlay>
</template>

<script>
import store from "../logic/sharedData"

export default {
  name: "SaveDialogue",
  props: ["mdp"],
  data() {
    return {
			store: store,
      name: null
    };
  },

  methods: {
    save() {
			if (!this.name) {
				this.name = "_auto";
			}
			store.commit('saveLevel', {
				name: this.name,
				mdp: this.mdp.compact()
			});
			store.commit('displayMDP');
    },
  },
};
</script>

<style scoped>
	#card {
		padding: 16px;
	}
	
	#headline {
		margin-bottom: 16px;
	}
</style>