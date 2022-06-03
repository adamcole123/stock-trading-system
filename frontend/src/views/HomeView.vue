<template>
  <div class="home">
    <StockList ref="stockList" />
  </div>
</template>

<script lang="ts">
import { Component, defineComponent } from "vue";
import StockList from "@/components/StockList.vue"; // @ is an alias to /src

export default defineComponent({
  name: "HomeView",
  components: {
    StockList,
  },
  beforeRouteLeave: function (to, from, next) {
    // Indicate to the SubComponent that we are leaving the route
    try {
      (this.$refs.stockList as any).prepareToExit();
    } catch (error) {
      console.log(error);
    }
    // Make sure to always call the next function, otherwise the hook will never be resolved
    // Ref: https://router.vuejs.org/en/advanced/navigation-guards.html
    next();
  },
});
</script>
