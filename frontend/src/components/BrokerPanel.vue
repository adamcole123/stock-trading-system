<template>
  <div>
    <h2>Broker</h2>
    <ApproveRejectTrades />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import ApproveRejectTrades from "./ApproveRejectTrades.vue";

export default defineComponent({
  name: "BrokerPanel",
  components: {
    ApproveRejectTrades,
  },
});
</script>
