// vuex.d.ts
import { Store } from "@/vuex";
import User from "./types/User";

declare module "@vue/runtime-core" {
  // declare your own store states
  interface State {
    registerApiStatus: "";
    buyStocksApiStatus: "";
    sellStocksApiStatus: "";
    getStocksApiStatus: "";
    getPendingTradesApiStatus: "";
    reportModalVisible: boolean;
    reportType: number;
    generateReportApiStatus: "";
    downloadReportApiStatus: "";
    getGetUserTransactionHistoryApiStatus: "";
    logOut: boolean;
    loginApiStatus: "";
    userProfile: User;
    stockData: [];
    userTransactionHistory: [];
    pendingTrades: [];
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
