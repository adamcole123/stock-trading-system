<template>
  <div class="account-page">
    <AccountDetails />
    <BrokerPanel v-if="getUserProfile.role === 'Broker'" />
    <AdminPanel v-if="getUserProfile.role === 'Admin'" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import AccountDetails from "../components/AccountDetails.vue";
import BrokerPanel from "../components/BrokerPanel.vue";
import AdminPanel from "../components/AdminPanel.vue";

export default defineComponent({
  name: "AccountView",
  components: {
    AdminPanel,
    AccountDetails,
    BrokerPanel,
  },
  computed: {
    ...mapGetters("auth", {
      getUserProfile: "getUserProfile",
    }),
  },
});
</script>
<style>
.account-page {
  width: 60%;
  margin: 0 auto;
}
</style>
