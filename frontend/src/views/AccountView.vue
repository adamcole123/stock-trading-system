<template>
  <div class="account-page">
    <AccountDetails />
    <BrokerPanel />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import AccountDetails from "../components/AccountDetails.vue";
import BrokerPanel from "../components/BrokerPanel.vue";

export default defineComponent({
  name: "AccountView",
  components: {
    AccountDetails,
    BrokerPanel,
  },
});
</script>
<style>
.account-page {
  width: 40%;
  margin: 0 auto;
}
</style>
