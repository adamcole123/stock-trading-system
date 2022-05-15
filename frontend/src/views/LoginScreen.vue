<template>
  <div>
    <form class="form">
      <label for="username">Username</label>
      <input
        type="text"
        v-model="loginInfo.username"
        placeholder="Username"
        name="username"
      />
      <label for="password">Password</label>
      <input
        type="password"
        v-model="loginInfo.password"
        placeholder="Password"
        name="password"
      />
    </form>
    <button @click="login">Login</button>
    <router-link to="/password-reset-request">Forgot Password?</router-link>
    <span v-if="errorText">{{ errorText }}</span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import Cookie from "js-cookie";

export default defineComponent({
  name: "LoginScreen",
  data: function () {
    return {
      loginInfo: {
        username: "",
        password: "",
      },
      errorText: "",
    };
  },
  computed: {
    ...mapGetters("auth", {
      getLoginApiStatus: "getLoginApiStatus",
    }),
  },
  methods: {
    ...mapActions("auth", {
      actionLoginApi: "loginApi",
      userProfile: "userProfile",
    }),
    async login() {
      console.log(this.loginInfo.username, this.loginInfo.password);
      const payload = {
        username: this.loginInfo.username,
        password: this.loginInfo.password,
      };
      let response = await this.actionLoginApi(payload);
      if (this.getLoginApiStatus == "success") {
        await this.userProfile();
        alert("Signed in successfully!");
        this.$router.push("/");
      } else {
        this.errorText = response;
      }
    },
  },
});
</script>
