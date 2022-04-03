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
    <span v-if="errorText">{{ errorText }}</span>
    <!-- <span v-if="localStorage.getItem('token')">Signed in!</span> -->
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

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
  methods: {
    login() {
      axios({
        method: "post",
        url: "http://localhost:8000/user/signin",
        headers: {},
        data: this.loginInfo,
      })
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          this.$router.push("/");
        })
        .catch((error) => {
          this.errorText = error;
        });
    },
  },
});
</script>
