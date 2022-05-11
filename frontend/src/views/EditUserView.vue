<template>
  <div class="edit-screen">
    <h1>Edit User Details</h1>
    <div class="form-group" v-for="key in Object.keys(user)" :key="key">
      <label>{{ splitCamelCaseOriginal(key) }}</label>
      <input v-if="key === 'id'" type="text" v-model="user[key]" disabled />
      <input v-else-if="key === 'birthDate'" type="date" v-model="user[key]" />
      <input
        v-else-if="key === 'isDeleted'"
        type="checkbox"
        v-model="user[key]"
      />
      <input v-else v-model="user[key]" />
    </div>
    <button class="btn btn-primary" @click="updateUser">Save</button>
  </div>
</template>
<script lang="ts">
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
    }),
  },
  methods: {
    ...mapActions("auth", {
      actionEditUserDetailsApi: "editUserDetails",
    }),
    ...mapActions("admin", {
      actionGetUserDetailsApi: "getUserDetailsApi",
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
      await this.actionEditUserDetailsApi(this.user);

      if (this.getEditUserApiStatus === "success") {
        await this.actionGetUserDetailsApi({ username: this.user.username });
        alert("User details updated successfully");
      } else {
        alert("Could not edit user");
      }
    },
  },
  created() {
    this.actionGetUserDetailsApi({
      username: this.$route.query.username,
    })
      .then((user) => {
        this.user = user;
        this.user.birthDate = new Date(this.user.birthDate)
          .toISOString()
          .split("T")[0];
        this.user.isDeleted = Boolean(this.user.isDeleted);
      })
      .catch(() => {
        alert("Could not get user details");
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
