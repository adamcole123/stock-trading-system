<template>
  <div>
    <h1>Enter a registered email address</h1>
    <input v-model="email" />
    <button @click="sendPasswordResetEmail">Request Email</button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";

export default defineComponent({
  name: "PasswordResetRequestView",
  data() {
    return {
      email: "",
    };
  },
  methods: {
    ...mapActions("auth", {
      actionPasswordResetRequest: "passwordResetRequest",
    }),
    async sendPasswordResetEmail() {
      await this.actionPasswordResetRequest({ email: this.email });
    },
  },
});
</script>
