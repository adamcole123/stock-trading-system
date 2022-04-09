<template>
  <div>
    <div class="navbar">
      <div class="left">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
        <router-link to="/contact" class="nav-link">Contact</router-link>
      </div>
      <div class="right">
        <div v-if="token">
          <router-link to="/account" class="nav-link"
            >{{ userData.firstName }}
            {{ userData.lastName }}
          </router-link>
          <span @click="signOut" class="nav-link">Sign out</span>
        </div>
        <div v-else>
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link">Register</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VueX from "vuex";

export default defineComponent({
  name: "NavBar",
  methods: {
    signOut() {
      this.updateToken("token", "");
      this.$router.go(0);
    },
    ...VueX.mapActions(["validateUser"]),
    ...VueX.mapMutations(["updateToken"]),
  },
  mounted: function () {
    this.validateUser();
  },
  computed: VueX.mapState(["userData", "token"]),
});
</script>
