<template>
  <div>
    <h1 v-if="getActivationApiStatus === 'success'">
      Thank you for activating your account!
    </h1>
    <router-link to="/login">Click here to sign in</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";

export default defineComponent({
  name: "ActivationView",
  data: function () {
    return {
      registerInfo: {
        username: "",
        email: "",
        firstName: "",
      },
    };
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
