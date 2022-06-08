<template>
  <table v-if="getPendingTrades.length > 0">
    <thead>
      <tr>
        <th>Time/Date</th>
        <th>User</th>
        <th>Quantity</th>
        <th>Value</th>
        <th>Total</th>
        <th>Stock Symbol</th>
        <th>Company Name</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="trade in getPendingTrades" :key="trade.id">
        <td>{{ moment(trade.time_of_trade).format("DD-MM-YYYY hh:mm:ss") }}</td>
        <td>{{ trade.user_id }}</td>
        <td>{{ trade.stock_amount }}</td>
        <td>{{ trade.stock_id.value }}</td>
        <td>{{ trade.stock_value * trade.stock_amount }}</td>
        <td>{{ trade.stock_id.symbol }}</td>
        <td>{{ trade.stock_id.name }}</td>
        <td>
          <button @click="approveTrade({ id: trade.id })">Approve</button>
          <button @click="rejectTrade({ id: trade.id })">Reject</button>
        </td>
      </tr>
    </tbody>
  </table>
  <h3 v-else>No pending trades</h3>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";

export default defineComponent({
  name: "ApproveRejectTrades",
  data() {
    return {
      moment: moment,
    };
  },
  methods: {
    ...mapActions("trade", {
      actionApproveTradeApi: "approveTrade",
      actionRejectTradeApi: "rejectTrade",
      actionPendingTradesApi: "pendingTrades",
    }),
    approveTrade(id: string) {
      this.actionApproveTradeApi(id);
    },
    rejectTrade(id: string) {
      this.actionRejectTradeApi(id);
    },
  },
  computed: {
    ...mapGetters("trade", {
      getPendingTrades: "getPendingTrades",
    }),
  },
  created() {
    this.actionPendingTradesApi();
  },
});
</script>
