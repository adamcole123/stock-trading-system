<template>
  <div>
    <table v-if="getUserTransactionHistory.length > 0">
      <thead>
        <tr>
          <th align="left">Stock Symbol</th>
          <th align="left">Stock Name</th>
          <th align="left">Purchase Value</th>
          <th align="left">Current Value</th>
          <th align="left">Quantity</th>
          <th align="left">Total</th>
          <th align="left">Trade Type</th>
          <th align="left">Trade Status</th>
          <th align="left">Time of Trade</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trade in getUserTransactionHistory" :key="trade.id">
          <td>{{ trade.symbol }}</td>
          <td>{{ trade.stock_name }}</td>
          <td>{{ trade.stock_value }}</td>
          <td>{{ trade.current_value }}</td>
          <td>{{ trade.stock_amount }}</td>
          <td>
            {{
              Number.parseFloat(
                `${trade.stock_amount * trade.stock_value}`
              ).toFixed(2)
            }}
          </td>
          <td>{{ trade.trade_type }}</td>
          <td>{{ trade.trade_status }}</td>
          <td>
            {{ moment(trade.time_of_trade).format("MMMM Do YYYY, h:mm:ss a") }}
          </td>
        </tr>
      </tbody>
    </table>
    <b v-else>You have not produced any transactions.</b>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";

export default defineComponent({
  name: "TransactionHistory",
  data() {
    return {
      moment: moment,
    };
  },
  computed: {
    ...mapGetters("trade", {
      getUserTransactionHistory: "getUserTransactionHistory",
    }),
  },
  created() {
    this.actionGetUserTransactionHistoryApi();
  },
  methods: {
    ...mapActions("trade", {
      actionGetUserTransactionHistoryApi: "getUserTransactionHistoryApi",
    }),
  },
});
</script>
