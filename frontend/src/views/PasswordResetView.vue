<template>
  <div>
    <div class="breadcrumb" v-if="getUserProfile.id !== ''">
      <router-link to="/account">Back to account</router-link>
    </div>
    <h1>Enter new password</h1>

    <label>Password</label><br />
    <input type="password" v-model="password" /><br />

    <label>Retype password</label><br />
    <input type="password" v-model="retypePassword" />

    <button @click="resetPassword">Reset Password</button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "PasswordResetView",
  data() {
    return {
      password: "",
      retypePassword: "",
    };
  },
  computed: {
    ...mapGetters("auth", {
      getUserProfile: "getUserProfile",
    }),
  },
  methods: {
    ...mapActions("auth", {
      actionPasswordReset: "passwordReset",
    }),
    async resetPassword() {
      if (this.password !== this.retypePassword) {
        alert("Passwords do not match");
        return;
      }
      const payload = {
        password: this.password,
        key: this.$route.query.key,
      };
      await this.actionPasswordReset(payload);
    },
  },
});
</script>
