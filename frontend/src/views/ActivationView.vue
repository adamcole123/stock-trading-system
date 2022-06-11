<template>
  <div>
    <div v-if="getActivationApiStatus === 'success'">
      <h1>Thank you for activating your account!</h1>
      <router-link to="/login">Click here to sign in</router-link>
    </div>
    <PulseLoader :color="loaderColor" v-else></PulseLoader>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

export default defineComponent({
  name: "ActivationView",
  data: function () {
    return {
      registerInfo: {
        username: "",
        email: "",
        firstName: "",
      },
      loaderColor: "#172a3a",
    };
  },
  components: {
    PulseLoader,
  },
  created: async function () {
    let payload = {
      token: this.$route.query.token,
    };
    await this.actionActivateAccount(payload);
  },
  computed: {
    ...mapGetters("auth", {
      getActivationApiStatus: "getActivationApiStatus",
    }),
  },
  methods: {
    ...mapActions("auth", {
      actionActivateAccount: "activateAccount",
    }),
  },
});
</script>
