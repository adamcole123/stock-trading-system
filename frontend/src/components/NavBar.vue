<template>
  <div>
    <div class="navbar">
      <div class="left">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
        <router-link to="/contact" class="nav-link">Contact</router-link>
      </div>
      <div class="right">
        <div v-if="getUserProfile.id === '' || getUserProfile.id === undefined">
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link">Register</router-link>
        </div>
        <div v-else>
          £{{ getUserProfile.credit }}
          <router-link to="/account" class="nav-link"
            >{{ getUserProfile.firstName }} {{ getUserProfile.lastName }}
          </router-link>
          <span @click="logout()" class="nav-link">Sign out</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default defineComponent({
  name: "NavBar",
  computed: {
    ...mapGetters("auth", {
      getUserProfile: "getUserProfile",
      getLogout: "getLogout",
    }),
  },
  methods: {
    ...mapActions("auth", {
      userLogout: "userLogout",
    }),
    ...mapMutations("auth", {
      setLogout: "setLogout",
      setUserProfile: "setUserProfile",
    }),
    async logout() {
      await this.userLogout();
      if (this.getLogout) {
        const resetUser = {
          id: "",
          lastName: "",
          firstName: "",
          email: "",
          username: "",
          phone: "",
        };
        this.setUserProfile(resetUser);
        this.setLogout(false);
        this.$router.push("/login");
      }
    },
  },
});
</script>
