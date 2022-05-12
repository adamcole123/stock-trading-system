<template>
  <div class="container">
    <div class="left-profile">
      <div class="user-profile">
        <img src="../assets/profile-pic.webp" class="profile-pic" />
        <div class="account-info">
          <h1>{{ getUserProfile.firstName }} {{ getUserProfile.lastName }}</h1>
          <h2>{{ getUserProfile.email }}</h2>
          <h3>{{ getUserProfile.username }}</h3>
          <h3>{{ getUserProfile.birthdate }}</h3>
          <router-link to="/account/edit">Change Account Details</router-link
          ><br />
          <router-link to="/password-reset">Change Password</router-link>
        </div>
      </div>
      <h1>Transaction History</h1>
      <TransactionHistory class="transaction-history" />
    </div>
    <div class="right-profile">
      <ReportsList />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import TransactionHistory from "./TransactionHistory.vue";
import ReportsList from "./ReportsList.vue";

export default defineComponent({
  name: "AccountDetails",
  computed: {
    ...mapGetters("auth", {
      getUserProfile: "getUserProfile",
    }),
  },
  components: { TransactionHistory, ReportsList },
});
</script>
<style>
.container {
  display: flex;
  padding: 10px;
  max-height: 500px;
  flex-direction: row;
}
.user-profile {
  width: 100%;
  display: flex;
}
.profile-pic {
  flex-grow: 2;
  max-height: 200px;
  max-width: 200px;
}
.account-info {
  flex-grow: 4;
}
.transaction-history {
  flex-grow: 6;
  width: 100%;
  overflow-y: scroll;
}
.left-profile {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
}
.right-profile {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
}
</style>
