<template>
  <div>
    <CreditCardConfirm
      v-if="showCardConfirm"
      :tradeType="typeOfTrade"
      :stockId="idOfStock"
      :stockAmount="tradeQuantity"
      @showHideCardConfirm="showCardConfirm = !showCardConfirm"
    />
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
        <template v-for="stock in getStockData" :key="stock.id">
          <tr v-if="stock.volume > 0">
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
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import { io } from "socket.io-client";
import CreditCardConfirm from "./CreditCardConfirm.vue";

const socket = io("http://localhost:8000/stockmarket");

export default defineComponent({
  name: "StockList",
  components: {
    CreditCardConfirm,
  },
  // props: ["tradeType", "stockId", "stockAmount"],
  data() {
    return {
      toggledTrades: [] as number[],
      tradeQuantity: 0,
      showCardConfirm: false,
      idOfStock: "",
      typeOfTrade: "",
    };
  },
  computed: {
    ...mapGetters("auth", {
      getUserProfile: "getUserProfile",
    }),
    ...mapGetters("stock", {
      getStockData: "getStockData",
    }),
    ...mapGetters("trade", {
      getBuyStocksApiStatus: "getBuyStocksApiStatus",
      getSellStocksApiStatus: "getSellStocksApiStatus",
    }),
  },
  created() {
    this.actionGetStocksApi({ page: 1, limit: 10 });
    socket.on("stocks", (data) => {
      this.actionUpdateStocksData([
        data.map((update: any) => {
          return {
            id: update.documentKey._id,
            ...update.updateDescription.updatedFields,
          };
        }),
        this.getStockData,
      ]);
    });
  },
  methods: {
    ...mapActions("trade", {
      actionBuyStocksApi: "buyStocksApi",
      actionSellStocksApi: "sellStocksApi",
    }),
    ...mapActions("stock", {
      actionGetStocksApi: "getStocksApi",
      actionUpdateStocksData: "updateStocksData",
    }),
    async buyStocks(stock_id: string) {
      this.typeOfTrade = "Buy";
      this.idOfStock = stock_id;
      this.showCardConfirm = true;
    },
    async sellStocks(stock_id: string) {
      this.typeOfTrade = "Sell";
      this.idOfStock = stock_id;
      this.showCardConfirm = true;
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
