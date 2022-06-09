<template>
  <div>
    <CreditCardConfirm
      v-if="showCardConfirm"
      :tradeType="typeOfTrade"
      :stockId="idOfStock"
      :stockAmount="tradeQuantity"
      :stockPrice="tradePrice"
      :stockName="stockName"
      :stockSymbol="stockSymbol"
      @showHideCardConfirm="showCardConfirm = !showCardConfirm"
    />
    <FundsSummary v-if="getUserProfile.id !== ''" />
    <div class="filter-controls" v-if="filtersEntered()">
      <button @click="applyFilters(true)">Apply Filters</button>
      <button @click="clearFilters">Clear Filters</button>
    </div>
    <table class="stocklist">
      <thead>
        <tr>
          <th
            v-if="getUserProfile.id !== '' && getUserProfile.role === 'User'"
          ></th>
          <th align="left">
            <input type="text" v-model="filter.symbol" placeholder="Symbol" />
            <button @click="orderBy('symbol')">
              <div
                v-if="
                  filter.orderBy !== undefined &&
                  filter.orderDirection !== undefined
                "
              >
                <div v-if="filter.orderBy && filter.orderBy === 'symbol'">
                  <arrow-down-thick
                    v-if="filter.orderDirection === '0'"
                  ></arrow-down-thick>
                  <arrow-up-thick
                    v-else-if="filter.orderDirection === '1'"
                  ></arrow-up-thick>
                  <span v-else>-</span>
                </div>
                <div v-else>-</div>
              </div>
              <span v-else>-</span>
            </button>
          </th>
          <th align="left">
            <input
              type="text"
              v-model="filter.name"
              placeholder="Company Name"
            />
            <button @click="orderBy('name')">
              <div
                v-if="
                  filter.orderBy !== undefined &&
                  filter.orderDirection !== undefined
                "
              >
                <div v-if="filter.orderBy && filter.orderBy === 'name'">
                  <arrow-down-thick
                    v-if="filter.orderDirection === '0'"
                  ></arrow-down-thick>
                  <arrow-up-thick
                    v-else-if="filter.orderDirection === '1'"
                  ></arrow-up-thick>
                  <span v-else>-</span>
                </div>
                <div v-else>-</div>
              </div>
              <span v-else>-</span>
            </button>
          </th>
          <th align="left">
            <input
              type="number"
              v-model="filter.gains"
              placeholder="Gains"
              step="0.01"
            />
            <button @click="orderBy('gains')">
              <div
                v-if="
                  filter.orderBy !== undefined &&
                  filter.orderDirection !== undefined
                "
              >
                <div v-if="filter.orderBy && filter.orderBy === 'gains'">
                  <arrow-down-thick
                    v-if="filter.orderDirection === '0'"
                  ></arrow-down-thick>
                  <arrow-up-thick
                    v-else-if="filter.orderDirection === '1'"
                  ></arrow-up-thick>
                  <span v-else>-</span>
                </div>
                <div v-else>-</div>
              </div>
              <span v-else>-</span>
            </button>
          </th>
          <th align="left">
            <input
              type="number"
              v-model="filter.value"
              placeholder="Value"
              step="0.01"
              min="0"
            />
            <button @click="orderBy('value')">
              <div
                v-if="
                  filter.orderBy !== undefined &&
                  filter.orderDirection !== undefined
                "
              >
                <div v-if="filter.orderBy && filter.orderBy === 'value'">
                  <arrow-down-thick
                    v-if="filter.orderDirection === '0'"
                  ></arrow-down-thick>
                  <arrow-up-thick
                    v-else-if="filter.orderDirection === '1'"
                  ></arrow-up-thick>
                  <span v-else>-</span>
                </div>
                <div v-else>-</div>
              </div>
              <span v-else>-</span>
            </button>
          </th>
          <th align="left">
            <input
              type="number"
              v-model="filter.volume"
              placeholder="Volume"
              min="0"
            />
            <button @click="orderBy('volume')">
              <div
                v-if="
                  filter.orderBy !== undefined &&
                  filter.orderDirection !== undefined
                "
              >
                <div v-if="filter.orderBy && filter.orderBy === 'volume'">
                  <arrow-down-thick
                    v-if="filter.orderDirection === '0'"
                  ></arrow-down-thick>
                  <arrow-up-thick
                    v-else-if="filter.orderDirection === '1'"
                  ></arrow-up-thick>
                  <span v-else>-</span>
                </div>
                <div v-else>-</div>
              </div>
              <span v-else>-</span>
            </button>
          </th>
          <th align="left">
            <input
              type="number"
              v-model="filter.open"
              placeholder="Open"
              step="0.01"
              min="0"
            />
            <button @click="orderBy('open')">
              <div
                v-if="
                  filter.orderBy !== undefined &&
                  filter.orderDirection !== undefined
                "
              >
                <div v-if="filter.orderBy && filter.orderBy === 'open'">
                  <arrow-down-thick
                    v-if="filter.orderDirection === '0'"
                  ></arrow-down-thick>
                  <arrow-up-thick
                    v-else-if="filter.orderDirection === '1'"
                  ></arrow-up-thick>
                  <span v-else>-</span>
                </div>
                <div v-else>-</div>
              </div>
              <span v-else>-</span>
            </button>
          </th>
          <th align="left">
            <input
              type="number"
              v-model="filter.close"
              placeholder="Close"
              step="0.01"
              min="0"
            />
            <button @click="orderBy('close')">
              <div
                v-if="
                  filter.orderBy !== undefined &&
                  filter.orderDirection !== undefined
                "
              >
                <div v-if="filter.orderBy && filter.orderBy === 'close'">
                  <arrow-down-thick
                    v-if="filter.orderDirection === '0'"
                  ></arrow-down-thick>
                  <arrow-up-thick
                    v-else-if="filter.orderDirection === '1'"
                  ></arrow-up-thick>
                  <span v-else>-</span>
                </div>
                <div v-else>-</div>
              </div>
              <span v-else>-</span>
            </button>
          </th>
        </tr>
        <tr>
          <th
            v-if="getUserProfile.id !== '' && getUserProfile.role === 'User'"
          ></th>
          <th></th>
          <th></th>
          <th align="left">Gains</th>
          <th align="left">Value</th>
          <th align="left">Volume</th>
          <th align="left">Open</th>
          <th align="left">Close</th>
          <th align="left">Last Trade</th>
          <th
            align="left"
            colspan="2"
            v-if="getUserProfile.id !== '' && getUserProfile.role === 'User'"
          >
            Quantity
            <input
              type="number"
              style="width: 40px"
              min="0"
              v-model="tradeQuantity"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="stock in getStockData" :key="stock.id">
          <tr v-if="stock.volume > 0" class="stockrow">
            <div
              v-if="
                getUserProfile.id !== '' &&
                getUserTransactionHistory !== undefined &&
                getUserProfile.role === 'User'
              "
            >
              <div
                v-if="
                  getUserTransactionHistory.findIndex(
                    (trade: any) => trade.stock_id === stock.id
                  ) !== -1
                "
              >
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
              </div>
              <div v-else>
                <td></td>
              </div>
            </div>

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
            <td>
              {{ moment(stock.latest_trade).format("DD/MM/YYYY hh:mm:ss") }}
            </td>
            <td
              v-if="getUserProfile.id !== '' && getUserProfile.role === 'User'"
            >
              <div
                v-if="
                  getUserProfile.credit > stock.value * tradeQuantity &&
                  tradeQuantity > 0
                "
              >
                <button
                  align="left"
                  @click="
                    buyStocks(stock.id, stock.value, stock.symbol, stock.name)
                  "
                >
                  Buy
                </button>
              </div>
              <div v-else>
                <button align="left" style="visibility: hidden">Buy</button>
              </div>
            </td>
            <td
              v-if="getUserProfile.id !== '' && getUserProfile.role === 'User'"
            >
              <div
                v-if="canSell[stock.id] >= tradeQuantity && tradeQuantity > 0"
              >
                <button
                  align="left"
                  @click="
                    sellStocks(stock.id, stock.value, stock.symbol, stock.name)
                  "
                >
                  Sell
                </button>
              </div>
              <div v-else>
                <button align="left" style="visibility: hidden">Sell</button>
              </div>
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
    <div class="nav-controls">
      <div>
        {{ filter.page > 1 ? filter.page - 1 : "" }}
        <button @click="previousPage" v-if="filter.page > 1">
          Previous Page
        </button>
      </div>
      <select v-model="filter.limit" @change="limitChanged">
        <option>20</option>
        <option>100</option>
        <option value="">All</option>
      </select>
      <div v-if="filter.page !== getLastPageNum && filter.limit !== undefined">
        <button @click="nextPage">Next Page</button>
        {{ Number(filter.page) + 1
        }}{{ getLastPageNum !== undefined ? `/${getLastPageNum}` : "/?" }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import { io } from "socket.io-client";
import CreditCardConfirm from "./CreditCardConfirm.vue";
import FundsSummary from "./FundsSummary.vue";
import Trade from "@/types/Trade";
import moment from "moment";
import Stock from "@/types/Stock";
import { ArrowDownThick, ArrowUpThick } from "mdue";

let socket = io("http://localhost:8000/stockmarket");

export default defineComponent({
  name: "StockList",
  components: {
    CreditCardConfirm,
    ArrowDownThick,
    ArrowUpThick,
    FundsSummary,
  },
  // props: ["tradeType", "stockId", "stockAmount"],
  data() {
    return {
      toggledTrades: {} as Record<string, Trade[]>,
      stockSymbol: "",
      stockName: "",
      tradeQuantity: 0,
      tradePrice: 0,
      showCardConfirm: false,
      idOfStock: "",
      typeOfTrade: "",
      moment: moment,
      filter: {} as Stock | any,
      canSell: {} as Record<string, number>,
    };
  },
  computed: {
    ...mapGetters("auth", {
      getUserProfile: "getUserProfile",
    }),
    ...mapGetters("stock", {
      getStockData: "getStockData",
      getLastPageNum: "getLastPageNum",
    }),
    ...mapGetters("trade", {
      getBuyStocksApiStatus: "getBuyStocksApiStatus",
      getSellStocksApiStatus: "getSellStocksApiStatus",
      getUserTransactionHistory: "getUserTransactionHistory",
    }),
  },
  async created() {
    socket = io("http://localhost:8000/stockmarket");
    if (!this.$route.query.page || !this.$route.query.limit) {
      this.filter.page = 1;
      this.filter.limit = 20;
    }
    if (!this.$route.query.orderBy || !this.$route.query.orderDirection) {
      this.filter.orderBy = "symbol";
      this.filter.orderDirection = "1";
    }

    this.filter = {
      ...this.filter,
      ...this.$route.query,
    };
    this.applyFilters();

    if (this.getUserProfile.id !== "") {
      await this.actionGetUserTransactionHistory();
      this.buildCanSellList();
    }
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
      actionGetUserTransactionHistory: "getUserTransactionHistoryApi",
    }),
    ...mapActions("stock", {
      actionGetStocksApi: "getStocksApi",
      actionUpdateStocksData: "updateStocksData",
      actionLastPageNum: "lastPageNum",
    }),
    ...mapActions("trade", {
      actionGetStockTradesForUserApi: "stockTradesForUserApi",
    }),
    async buyStocks(
      stock_id: string,
      stock_value: number,
      stock_symbol: string,
      stock_name: string
    ) {
      this.typeOfTrade = "Buy";
      this.idOfStock = stock_id;
      this.tradePrice = stock_value;
      this.stockSymbol = stock_symbol;
      this.stockName = stock_name;
      this.showCardConfirm = true;
    },
    async sellStocks(
      stock_id: string,
      stock_value: number,
      stock_symbol: string,
      stock_name: string
    ) {
      this.typeOfTrade = "Sell";
      this.idOfStock = stock_id;
      this.tradePrice = stock_value;
      this.stockSymbol = stock_symbol;
      this.stockName = stock_name;
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
    clearFilters() {
      delete this.filter.symbol;
      delete this.filter.name;
      delete this.filter.value;
      delete this.filter.volume;
      delete this.filter.open;
      delete this.filter.close;
      delete this.filter.gains;
      this.filter.page = 1;
      this.applyFilters();
    },
    previousPage() {
      console.log("previous");
      this.filter.page = this.filter.page - 1;
      this.applyFilters();
    },
    nextPage() {
      console.log("next");
      this.filter.page = Number(this.filter.page) + 1;
      this.applyFilters();
    },
    applyFilters(resetPage = false) {
      if (resetPage) {
        this.filter.page = 1;
      }
      this.$router.replace({
        name: "home",
        query: {
          ...this.filter,
        },
      });
      this.actionGetStocksApi(this.filter);
      this.actionLastPageNum(this.filter);
    },
    limitChanged() {
      this.filter.page = 1;
      if (this.filter.limit === "") {
        delete this.filter.limit;
      }
      this.applyFilters();
    },
    orderBy(field: string) {
      console.log(field, this.filter.orderBy);
      if (
        this.filter.orderBy === undefined &&
        this.filter.orderDirection === undefined
      ) {
        this.filter.orderBy = field;
        this.filter.orderDirection = "1";
      } else {
        if (this.filter.orderBy === field) {
          if (this.filter.orderDirection === "1") {
            this.filter.orderDirection = "0";
          } else if (this.filter.orderDirection === "0") {
            delete this.filter.orderDirection;
          } else {
            this.filter.orderDirection = "1";
          }
        } else {
          this.filter.orderBy = field;
          this.filter.orderDirection = "1";
        }
      }
      this.filter.page = 1;
      this.applyFilters();
    },
    prepareToExit() {
      socket.close();
    },
    buildCanSellList() {
      const transactions: Trade[] = this.getUserTransactionHistory;
      transactions.forEach((transaction: any) => {
        if (transaction.trade_status === "Approved") {
          if (this.canSell[transaction.stock_id] === undefined) {
            this.canSell[transaction.stock_id] = 0;
          }
          if (transaction.trade_type === "Buy") {
            this.canSell[transaction.stock_id] =
              this.canSell[transaction.stock_id] + transaction.stock_amount;
          } else {
            this.canSell[transaction.stock_id] =
              this.canSell[transaction.stock_id] - transaction.stock_amount;
          }
        }
      });
    },
    filtersEntered() {
      if (
        this.filter.symbol ||
        this.filter.name ||
        this.filter.value ||
        this.filter.volume ||
        this.filter.open ||
        this.filter.close ||
        this.filter.gains
      ) {
        return true;
      } else {
        return false;
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
.trades-table {
  width: 100%;
  border-collapse: collapse;
  background-color: lightgrey;
}
.trades-table > tbody > tr > td {
  border: 1px solid black;
  padding: 5px;
}
.nav-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.filter-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.stockrow:hover {
  background-color: lightgrey;
}
</style>
