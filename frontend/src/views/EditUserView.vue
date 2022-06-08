<template>
  <div class="edit-screen">
    <h1>Edit User Details</h1>
    <form @submit.prevent="updateUser">
      <div class="form-group" v-for="key in Object.keys(user)" :key="key">
        <label>{{ splitCamelCaseOriginal(key) }}</label>
        <input
          v-if="key === 'id' || key === 'username'"
          type="text"
          v-model="user[key]"
          disabled
        />
        <input
          v-else-if="key === 'credit'"
          type="number"
          v-model="user[key]"
          disabled
        />
        <input
          v-else-if="key === 'email'"
          type="text"
          v-model="user[key]"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          oninvalid="this.setCustomValidity('This must be in email format')"
          onchange="try{setCustomValidity('')}catch(e){}"
          oninput="setCustomValidity(' ')"
        />
        <input
          v-else-if="key === 'firstName' || key === 'lastName'"
          type="text"
          v-model="user[key]"
          pattern="([a-zA-Z]|\s|\.)+"
          oninvalid="this.setCustomValidity('This must only contain letters or spaces')"
          onchange="try{setCustomValidity('')}catch(e){}"
          oninput="setCustomValidity(' ')"
        />
        <div v-else-if="key === 'role'">
          <input type="text" v-model="user[key]" disabled />
          <button
            @click="makeUserBroker(user['username'])"
            v-if="user['role'] === 'User' && getUserProfile.role === 'Admin'"
          >
            Convert to Broker
          </button>
          <button
            @click="makeBrokerUser(user['username'])"
            v-else-if="
              user['role'] === 'Broker' && getUserProfile.role === 'Admin'
            "
          >
            Convert to User
          </button>
        </div>
        <input
          v-else-if="key === 'birthDate'"
          type="date"
          v-model="user[key]"
        />
        <input
          v-else-if="getUserProfile.role === 'Admin' && key === 'banUntil'"
          type="date"
          v-model="user[key]"
        />
        <input
          v-else-if="key === 'banUntil'"
          type="date"
          v-model="user[key]"
          disabled
        />
        <input
          v-else-if="key === 'activationDate'"
          type="date"
          v-model="user[key]"
          disabled
        />
        <input
          v-else-if="key === 'isDeleted' && getUserProfile.role === 'Admin'"
          type="checkbox"
          v-model="user[key]"
        />
        <input
          v-else-if="key === 'isDeleted'"
          type="checkbox"
          v-model="user[key]"
          disabled
        />
        <input v-else v-model="user[key]" />
      </div>
      <input type="submit" value="Save" class="btn btn-primary" />
    </form>
  </div>
</template>
<script lang="ts">
import router from "@/router";
import User from "@/types/User";
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "EditUserView",
  data() {
    return {
      user: {} as { [key: string]: any },
    };
  },
  computed: {
    ...mapGetters("auth", {
      getEditUserApiStatus: "getEditUserApiStatus",
      getUserProfile: "getUserProfile",
    }),
    ...mapGetters("admin", {
      getMakeUserBrokerApiStatus: "getMakeUserBrokerApiStatus",
    }),
  },
  methods: {
    ...mapActions("auth", {
      actionEditUserDetailsApi: "editUserDetails",
    }),
    ...mapActions("admin", {
      actionGetUserDetailsApi: "getUserDetailsApi",
      actionMakeUserBrokerApi: "makeUserBrokerApi",
    }),
    splitCamelCaseOriginal(camelCaseString: string) {
      const result = camelCaseString
        .replace(/([A-Z][a-z])/g, " $1")
        .replace(/([A-Z]+)/g, " $1")
        .replace(/ +/g, " ")
        .replace(/^ +/g, "");

      return result.charAt(0).toUpperCase() + result.slice(1);
    },
    async updateUser() {
      let ageOfUser = this.getAge(this.user.birthDate);
      if (ageOfUser < 18) {
        alert("User must be at least 18 years old");
        return;
      }
      await this.actionEditUserDetailsApi(this.user);

      if (this.getEditUserApiStatus === "success") {
        await this.actionGetUserDetailsApi({ username: this.user.username });
        if (this.getUserProfile.role === "Admin") {
          alert("User details updated successfully");
        } else {
          alert("You have been sent an email to confirm these changes");
        }
        this.$router.push("/account");
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
    async makeUserBroker(username: string) {
      await this.actionMakeUserBrokerApi({
        username: username,
        role: "Broker",
      });

      if (this.getMakeUserBrokerApiStatus === "success") {
        alert("User is now a broker");
        router.go(0);
      }
    },
    async makeBrokerUser(username: string) {
      await this.actionMakeUserBrokerApi({
        username: username,
        role: "User",
      });

      if (this.getMakeUserBrokerApiStatus === "success") {
        alert("Broker is now a standard user");
        router.go(0);
      }
    },
  },
  created() {
    this.actionGetUserDetailsApi({
      username: this.$route.query.username,
    })
      .then((user) => {
        this.user = user;
        console.log(user);
        if (this.user.birthDate !== undefined) {
          this.user.birthDate = new Date(this.user.birthDate)
            .toISOString()
            .split("T")[0];
        }
        if (this.user.activationDate !== undefined) {
          this.user.activationDate = new Date(this.user.activationDate)
            .toISOString()
            .split("T")[0];
        }
        if (this.user.isDeleted !== undefined) {
          this.user.isDeleted = Boolean(this.user.isDeleted);
        }
        if (this.user.banUntil === undefined) {
          this.user.banUntil = undefined;
        } else {
          this.user.banUntil = new Date(this.user.banUntil)
            .toISOString()
            .split("T")[0];
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
});
</script>
<style>
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
}
</style>
