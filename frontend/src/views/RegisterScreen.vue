<template>
  <div>
    <form class="form">
      <label for="firstName">First Name</label>
      <input
        type="text"
        v-model="registerInfo.firstName"
        placeholder="First Name"
        name="firstName"
      />
      <label for="lastName">Last Name</label>
      <input
        type="text"
        v-model="registerInfo.lastName"
        placeholder="Last Name"
        name="lastName"
      />
      <label for="email">Email</label>
      <input
        type="text"
        v-model="registerInfo.email"
        placeholder="Email"
        name="email"
      />
      <label for="username">Username</label>
      <input
        type="text"
        v-model="registerInfo.username"
        placeholder="Username"
        name="username"
      />
      <label for="password">Password</label>
      <input
        type="password"
        v-model="registerInfo.password"
        placeholder="Password"
        name="password"
      />
    </form>
    <button @click="register">Register</button>
    <span v-if="errorText">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { mapMutations, mapState } from "vuex";

export default defineComponent({
  name: "RegisterScreen",
  data: function () {
    return {
      registerInfo: {
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
      },
      errorText: "",
    };
  },
  methods: {
    register() {
      axios({
        method: "post",
        url: "http://localhost:8000/user/register",
        headers: {},
        data: this.registerInfo,
      })
        .then(async (response) => {
          console.log(response);
          await this.updateToken(response.data.token);
          this.$router.go(0);
        })
        .catch((error) => {
          if (error.response.status === 400) {
            this.errorText = "Invalid username, password, or email address";
          } else {
            this.errorText = "Something went wrong";
          }
        });
    },
    ...mapMutations(["updateToken"]),
  },
  mounted: function () {
    if (this.token) {
      this.$router.push("/");
    }
  },
  computed: mapState(["token"]),
});
</script>
