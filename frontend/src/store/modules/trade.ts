import { State } from "vue";
import axios from "axios";
import { ContextFunction } from "../ContextFunction";
import { store } from "..";

const state = () => ({
  buyStocksApiStatus: "",
  sellStocksApiStatus: "",
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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
