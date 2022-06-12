<template>
  <div class="container">
    <div class="left-profile">
      <div class="user-profile">
        <img src="../assets/profile-pic.webp" class="profile-pic" />
        <div class="account-info">
          <h1>
            {{ getUserProfile.firstName }}
            {{ getUserProfile.lastName }}
          </h1>
          <h3>Username: {{ getUserProfile.username }}</h3>
          <h3>Email Address: {{ getUserProfile.email }}</h3>
          <h3 v-if="getUserProfile.birthDate">
            Date of Birth:
            {{ moment(getUserProfile.birthDate).format("DD/MM/YYYY") }}
          </h3>
          <router-link
            :to="{
              name: 'user',
              query: { username: getUserProfile.username },
            }"
            >Change Account Details</router-link
          ><br />
          <a
            v-if="getUserProfile.role === 'User'"
            @click="actionRequestAccountDeactivation(getUserProfile.username)"
            >Request Account Deactivation</a
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
import { mapGetters, mapActions } from "vuex";
import TransactionHistory from "./TransactionHistory.vue";
import ReportsList from "./ReportsList.vue";
import moment from "moment";

export default defineComponent({
  name: "AccountDetails",
  data: function () {
    return {
      moment: moment,
    };
  },
  computed: {
    ...mapGetters("auth", {
      getUserProfile: "getUserProfile",
    }),
  },
  methods: {
    ...mapActions("auth", {
      actionRequestAccountDeactivation: "requestAccountDeactivation",
    }),
  },
  components: { TransactionHistory, ReportsList },
});
</script>
<style>
a {
  color: rgb(2, 45, 136);
  text-decoration: underline;
  cursor: pointer;
}
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
