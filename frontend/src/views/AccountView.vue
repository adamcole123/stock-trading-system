<template>
  <div>
    <AccountDetails class="account-details" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import AccountDetails from "../components/AccountDetails.vue";

export default defineComponent({
  name: "AccountView",
  components: {
    AccountDetails,
  },
});
</script>
<style>
.account-details {
  width: 40%;
  margin: 0 auto;
}
</style>
