<template>
  <div>
    <h1>
      {{ editStatus }}
    </h1>
    <router-link to="/account">OK</router-link>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "EditAccountView",
  data() {
    return {
      editStatus: "",
    };
  },
  created() {
    this.updateUser();
  },
  computed: {
    ...mapGetters("auth", {
      getEditUserApiStatus: "getEditUserApiStatus",
      getUserProfile: "getUserProfile",
    }),
  },
  methods: {
    ...mapActions("auth", {
      actionEditUserDetailsApi: "editUserDetails",
    }),
    async updateUser() {
      await this.actionEditUserDetailsApi({
        key: this.$route.query.key,
        username: this.getUserProfile.username,
      });

      if (this.getEditUserApiStatus === "success") {
        this.editStatus = "User details updated successfully";
      } else {
        this.editStatus = "Could not edit user";
      }
    },
  },
});
</script>
