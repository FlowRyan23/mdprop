<template>
  <v-overlay :dark="$vuetify.theme.dark">
    <v-card id="card" class="d-flex flex-column">
		<v-card-title primary-title>
			{{$t('saver.title')}}

			<v-spacer></v-spacer>

			<v-btn @click="store.commit('displayMDP')" rounded icon>
				<v-icon size="32">mdi-close-thick</v-icon>
			</v-btn>
		</v-card-title>

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
			@keydown="keyHandler"
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
		let world = this.mdp.compact();
		world.name = this.name;
		store.commit('saveLevel', world);
		store.commit('displayMDP');
    },

		keyHandler(event) {
			if (event.key === "Enter") {
				this.save();
			}
		}
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