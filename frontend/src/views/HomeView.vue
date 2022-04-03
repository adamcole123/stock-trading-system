<template>
  <div class="home">
    <StockList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StockList from "@/components/StockList.vue"; // @ is an alias to /src

export default defineComponent({
  name: "HomeView",
  components: {
    StockList,
  },
});
</script>
