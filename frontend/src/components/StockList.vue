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
          <th v-if="getUserProfile.id !== ''"></th>
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
            <td
              v-if="
                getUserProfile.id !== '' &&
                Object.keys(toggledTrades).includes(stock.id)
              "
              @click="viewTrades(stock.id)"
            >
              <button>-</button>
            </td>
            <td
              v-else-if="getUserProfile.id !== ''"
              @click="viewTrades(stock.id)"
            >
              <button>+</button>
            </td>
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
          <tr v-if="Object.keys(toggledTrades).includes(stock.id)">
            <td colspan="10">
              <table
                class="trades-table"
                v-if="toggledTrades[stock.id].length > 0"
              >
                <thead>
                  <tr>
                    <th>Trade Type</th>
                    <th>Time of Trade</th>
                    <th>Amount Traded</th>
                    <th>Stock Value at Time of Trade</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="trade in toggledTrades[stock.id]" :key="trade.id">
                    <td>{{ trade.trade_type }}</td>
                    <td>{{ moment(trade.time_of_trade).toLocaleString() }}</td>
                    <td>{{ trade.stock_amount }}</td>
                    <td>{{ trade.stock_value }}</td>
                    <td
                      v-if="trade.trade_status! === 'Pending'"
                      style="color: grey"
                    >
                      Pending Approval
                    </td>
                  </tr>
                  <tr colspan="10">
                    <b>Total Owned</b>
                    {{
                      toggledTrades[stock.id].reduce((acc, curr) => {
                        if(curr.trade_status === "Pending")
                          return acc;
                        return curr.trade_type === "Buy"
                          ? acc + curr.stock_amount!
                          : acc - curr.stock_amount!;
                      }, 0)
                    }}
                    <b>Total Value Owned</b>
                    {{
                      Number.parseFloat(toggledTrades[stock.id].reduce((acc, curr) => {
                        if(curr.trade_status === "Pending" || curr.trade_type === "Sell")
                          return acc;
                        return acc + (curr.stock_amount! * stock.value!);
                      }, 0).toString()).toFixed(2)
                    }}
                  </tr>
                </tbody>
              </table>
              <b v-else>You have not made any trades for this stock</b>
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
import Trade from "@/types/Trade";
import moment from "moment";

const socket = io("http://localhost:8000/stockmarket");

export default defineComponent({
  name: "StockList",
  components: {
    CreditCardConfirm,
  },
  // props: ["tradeType", "stockId", "stockAmount"],
  data() {
    return {
      toggledTrades: {} as Record<string, Trade[]>,
      tradeQuantity: 0,
      showCardConfirm: false,
      idOfStock: "",
      typeOfTrade: "",
      moment: moment,
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
    ...mapActions("trade", {
      actionGetStockTradesForUserApi: "stockTradesForUserApi",
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
    async viewTrades(stock_id: string) {
      if (Object.keys(this.toggledTrades).includes(stock_id)) {
        delete this.toggledTrades[stock_id];
        return;
      } else {
        this.toggledTrades[stock_id] = [];
      }

      this.toggledTrades[stock_id] = await this.actionGetStockTradesForUserApi({
        stock_id: stock_id,
        user_id: this.getUserProfile.id,
      });
    },
  },
});
</script>
<style>
.stocklist {
  width: 100%;
  border-collapse: collapse;
}
.trades-table {
  width: 100%;
  border-collapse: collapse;
  background-color: lightgrey;
}
.trades-table > tbody > tr > td {
  border: 1px solid black;
  padding: 5px;
}
</style>
