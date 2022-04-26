<template>
  <div>
    <table class="stocklist">
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th align="left">Gains</th>
          <th align="left">Value</th>
          <th align="left">Volume</th>
          <th align="left">Open</th>
          <th align="left">Close</th>
          <th align="left" colspan="2" v-if="getUserProfile.id !== ''">
            Quantity
            <input type="number" style="width: 40px" v-model="tradeQuantity" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stock in stocks" :key="stock.id">
          <td>{{ stock.symbol }}</td>
          <td>{{ stock.name }}</td>
          <td v-if="stock.gains! > 0" style="color: green">
            {{ stock.gains }}
          </td>
          <td v-else style="color: red">
            {{ stock.gains }}
          </td>
          <td>{{ stock.value }}</td>
          <td>{{ stock.volume }}</td>
          <td>{{ stock.open }}</td>
          <td>{{ stock.close }}</td>
          <td v-if="getUserProfile.id !== ''">
            <button align="left" @click="buyStocks(stock.id)">Buy</button>
          </td>
          <td v-if="getUserProfile.id !== ''">
            <button align="left" @click="sellStocks(stock.id)">Sell</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import Stock from "../types/Stock";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "StockList",
  data() {
    return {
      stocks: [] as Stock[],
      toggledTrades: [] as number[],
      tradeQuantity: 0,
    };
  },
  computed: {
    ...mapGetters("auth", {
      getUserProfile: "getUserProfile",
    }),
    ...mapGetters("trade", {
      getBuyStocksApiStatus: "getBuyStocksApiStatus",
      getSellStocksApiStatus: "getSellStocksApiStatus",
    }),
  },
  created() {
    axios({
      method: "get",
      url: "http://localhost:8000/stock/getMany?page=1",
    }).then((response) => {
      this.stocks = response.data;
    });
  },
  methods: {
    ...mapActions("trade", {
      actionBuyStocksApi: "buyStocksApi",
      actionSellStocksApi: "sellStocksApi",
    }),
    async buyStocks(stock_id: string) {
      const payload = {
        stock_id: stock_id,
        user_id: this.getUserProfile.id,
        stock_amount: this.tradeQuantity,
      };
      await this.actionBuyStocksApi(payload);
      if (this.getBuyStocksApiStatus == "success") {
        alert("Buy trade successfully!");
      } else {
        alert("Buy trade failed!");
      }
    },
    async sellStocks(stock_id: string) {
      const payload = {
        stock_id: stock_id,
        user_id: this.getUserProfile.id,
        stock_amount: this.tradeQuantity,
      };
      await this.actionSellStocksApi(payload);
      if (this.getBuyStocksApiStatus == "success") {
        alert("Sell trade successfully!");
      } else {
        alert("Sell trade failed!");
      }
    },
  },
});
</script>
<style>
.stocklist {
  width: 100%;
  border-collapse: collapse;
}
</style>
