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
import { mapMutations, mapState } from "vuex";
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
  mounted: function () {
    if (this.$store.token) {
      this.$router.push("/");
    }
  },
  methods: {
    login() {
      let config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        credentials: "include",
      };

      axios
        .post("http://localhost:8000/user/signin", this.loginInfo, {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
          console.log(Cookie.get("token"));
          this.updateToken(Cookie.get("token"));
          this.$router.push("/");
          this.$router.go(0);
        })
        .catch((error) => {
          if (error.status === 400) {
            this.errorText = "Invalid username or password";
          } else {
            this.errorText = "Something went wrong";
          }
        });
    },
    ...mapMutations(["updateToken"]),
  },
  computed: mapState(["token"]),
});
</script>
