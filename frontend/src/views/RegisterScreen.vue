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
import { mapActions, mapGetters } from "vuex";

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
  computed: {
    ...mapGetters("auth", {
      getRegisterApiStatus: "getRegisterApiStatus",
    }),
  },
  methods: {
    ...mapActions("auth", {
      actionRegisterApi: "registerApi",
      userProfile: "userProfile",
    }),
    async register() {
      console.log(this.registerInfo.username, this.registerInfo.password);
      const payload = {
        username: this.registerInfo.username,
        password: this.registerInfo.password,
        firstName: this.registerInfo.firstName,
        lastName: this.registerInfo.lastName,
        email: this.registerInfo.email,
      };
      await this.actionRegisterApi(payload);
      if (this.getRegisterApiStatus == "success") {
        await this.userProfile();
        alert("Account registered successfully!");
        this.$router.push("/");
      } else {
        this.errorText = "Could not register an account with those details";
      }
    },
  },
});
</script>
