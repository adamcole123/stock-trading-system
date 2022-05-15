import { State } from "vue";
import axios from "axios";
import { ContextFunction } from "../ContextFunction";
import { store } from "..";
import router from "./../../router/index";

const state = () => ({
  buyStocksApiStatus: "",
  sellStocksApiStatus: "",
  pendingTrades: [],
  getPendingTradesApiStatus: "",
});

const getters = {
  getBuyStocksApiStatus(state: State) {
    return state.buyStocksApiStatus;
  },
  getSellStocksApiStatus(state: State) {
    return state.sellStocksApiStatus;
  },
  getGetUserTransactionHistoryApiStatus(state: State) {
    return state.getGetUserTransactionHistoryApiStatus;
  },
  getUserTransactionHistory(state: State) {
    return state.userTransactionHistory;
  },
  getPendingTrades(state: State) {
    return state.pendingTrades;
  },
};

const actions = {
  async buyStocksApi({ commit, dispatch }: ContextFunction, payload: any) {
    const response = await axios
      .post("http://localhost:8000/trade/buystocks", payload, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      commit("setBuyStocksApiStatus", "success");
      dispatch("auth/userProfile", "", { root: true });
    } else {
      commit("setBuyStocksApiStatus", "failed");
      dispatch("auth/userProfile", "", { root: true });
      router.go(0);
    }
  },
  async sellStocksApi({ commit, dispatch }: ContextFunction, payload: any) {
    const response = await axios
      .post("http://localhost:8000/trade/sellstocks", payload, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      commit("setSellStocksApiStatus", "success");
      dispatch("auth/userProfile", "", { root: true });
    } else {
      commit("setSellStocksApiStatus", "failed");
    }
  },
  async getUserTransactionHistoryApi(
    { commit, dispatch }: ContextFunction,
    payload: any
  ) {
    const userProfile = store.getters["auth/getUserProfile"];
    const response = await axios
      .get(
        `http://localhost:8000/trade/usertransactions?user_id=${userProfile.id}`,
        {
          withCredentials: true,
        }
      )
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      console.log(response);
      commit("setUserTransactionHistory", response.data);
      commit("setGetUserTransactionHistoryApiStatus", "success");
    } else {
      commit("setGetUserTransactionHistoryApiStatus", "failed");
    }
  },
  async approveTrade({ commit, dispatch }: ContextFunction, payload: any) {
    const response = await axios
      .post(`http://localhost:8000/trade/approvetrade`, payload, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      commit("setApproveTradeApiStatus", "success");
      dispatch("pendingTrades");
      dispatch("getUserTransactionHistoryApi");
      dispatch("auth/userProfile", "", { root: true });
    } else {
      commit("setApproveTradeApiStatus", "failed");
    }
  },
  async rejectTrade({ commit, dispatch }: ContextFunction, payload: any) {
    const response = await axios
      .post(`http://localhost:8000/trade/rejecttrade`, payload, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      commit("setGetRejectTradeApiStatus", "success");
      dispatch("getUserTransactionHistoryApi");
      dispatch("pendingTrades");
      dispatch("auth/userProfile", "", { root: true });
    } else {
      commit("setGetRejectTradeApiStatus", "failed");
    }
  },
  async pendingTrades({ commit, dispatch }: ContextFunction, payload: any) {
    const response = await axios
      .get(`http://localhost:8000/trade/pendingtrades`, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      console.log(response);
      commit("setPendingTrades", response.data);
      commit("setGetPendingTradesApiStatus", "success");
    } else {
      commit("setGetPendingTradesApiStatus", "failed");
    }
  },
};

const mutations = {
  setBuyStocksApiStatus(state: State, data: any) {
    state.buyStocksApiStatus = data;
  },
  setSellStocksApiStatus(state: State, data: any) {
    state.sellStocksApiStatus = data;
  },
  setGetUserTransactionHistoryApiStatus(state: State, data: any) {
    state.getGetUserTransactionHistoryApiStatus = data;
  },
  setUserTransactionHistory(state: State, data: any) {
    state.userTransactionHistory = data;
  },
  setGetPendingTradesApiStatus(state: State, data: any) {
    state.getPendingTradesApiStatus = data;
  },
  setPendingTrades(state: State, data: any) {
    state.pendingTrades = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
