<template>
  <div>
    <form class="form" @submit.prevent="register">
      <label for="firstName">First Name</label>
      <input
        type="text"
        v-model="registerInfo.firstName"
        placeholder="First Name"
        name="firstName"
        required
      />
      <label for="lastName">Last Name</label>
      <input
        type="text"
        v-model="registerInfo.lastName"
        placeholder="Last Name"
        name="lastName"
        required
      />
      <label for="email">Email</label>
      <input
        type="email"
        v-model="registerInfo.email"
        placeholder="Email"
        name="email"
        required
      />
      <label for="confirmEmail">Confirm Email</label>
      <input
        type="email"
        v-model="confirmEmail"
        placeholder="Confirm Email"
        name="confirmEmail"
        required
      />
      <label for="birthDate">Date of Birth</label>
      <input
        type="date"
        v-model="registerInfo.birthDate"
        placeholder="Date of Birth"
        name="birthDate"
      />
      <label for="username">Username</label>
      <input
        type="text"
        v-model="registerInfo.username"
        placeholder="Username"
        name="username"
        required
      />
      <label for="password">Password</label>
      <input
        type="password"
        v-model="registerInfo.password"
        placeholder="Password"
        name="password"
        required
      />
      <label for="confirmPassword">Confirm Password</label>
      <input
        type="password"
        v-model="confirmPassword"
        placeholder="Confirm Password"
        name="confirmPassword"
        required
      />
      <input type="submit" value="Register" />
    </form>
    <span v-if="errorText">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import moment from "moment";
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
        birthDate: "",
      },
      confirmEmail: "",
      confirmPassword: "",
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
      let ageOfUser = this.getAge(this.registerInfo.birthDate);

      if (ageOfUser < 18) {
        this.errorText = "You must be 18 years or older to register";
        return;
      }
      if (this.confirmEmail !== this.registerInfo.email) {
        this.errorText = "Emails do not match";
        return;
      }
      if (this.confirmPassword !== this.registerInfo.password) {
        this.errorText = "Passwords do not match";
        return;
      }
      const payload = {
        username: this.registerInfo.username,
        password: this.registerInfo.password,
        firstName: this.registerInfo.firstName,
        lastName: this.registerInfo.lastName,
        email: this.registerInfo.email,
        birthDate: this.registerInfo.birthDate,
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
    getAge(DOB: string) {
      var today = new Date();
      var birthDate = new Date(DOB);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
  },
});
</script>
