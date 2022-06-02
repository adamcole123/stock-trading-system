<template>
  <div>
    <h1>Enter new password</h1>

    <label>Password</label>
    <input type="password" v-model="password" />

    <label>Retype password</label>
    <input type="password" v-model="password" />

    <button @click="resetPassword">Reset Password</button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";

export default defineComponent({
  name: "PasswordResetView",
  data() {
    return {
      password: "",
    };
  },
  methods: {
    ...mapActions("auth", {
      actionPasswordReset: "passwordReset",
    }),
    async resetPassword() {
      const payload = {
        password: this.password,
        key: this.$route.query.key,
      };
      await this.actionPasswordReset(payload);
    },
  },
});
</script>
