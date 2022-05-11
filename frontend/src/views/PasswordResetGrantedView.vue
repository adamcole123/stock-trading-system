<template>
  <div>
    <h1>Password reset email sent</h1>
    <router-link v-if="getUserProfile.id !== ''" to="/account">OK</router-link>
    <router-link v-else to="/login">OK</router-link>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "PasswordResetGrantedView",
  computed: {
    ...mapGetters("auth", {
      getUserProfile: "getUserProfile",
    }),
  },
});
</script>
