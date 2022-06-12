<template>
  <div v-if="portfolio !== undefined" class="fundsummary">
    <div>Invested: £{{ portfolio.invested }}</div>
    <div>
      Return:
      <span v-if="portfolio.return > 0" style="color: green"
        >£{{ portfolio.return }}</span
      >
      <span v-else style="color: red">£{{ portfolio.return }}</span>
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
    setInterval(() => {
      this.actionGetPortfolio();
    }, 1000);
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
