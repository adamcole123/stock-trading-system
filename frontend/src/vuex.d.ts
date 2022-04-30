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
    reportModalVisible: boolean;
    reportType: number;
    generateReportApiStatus: "";
    getGetUserTransactionHistoryApiStatus: "";
    logOut: boolean;
    loginApiStatus: "";
    userProfile: User;
    stockData: [];
    userTransactionHistory: [];
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
