<template>
  <div v-if="portfolio !== undefined" class="fundsummary">
    <div>Invested: £{{ portfolio.invested }}</div>
    <div>
      Return:
      <span v-if="portfolio.return < 0">£{{ portfolio.return }}</span>
      <span v-else>£{{ portfolio.return }}</span>
    </div>
    <div>Portfolio: £{{ portfolio.portfolio }}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";

export default defineComponent({
  name: "FundsSummary",
  data() {
    return {};
  },
  created() {
    this.actionGetPortfolio();
  },
  computed: {
    ...mapGetters("trade", {
      portfolio: "getPortfolio",
    }),
  },
  methods: {
    ...mapActions("trade", {
      actionGetPortfolio: "getPortfolio",
    }),
  },
});
</script>
<style scoped lang="scss">
.fundsummary {
  display: flex;
  justify-content: space-around;
}
</style>
