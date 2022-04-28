import { State } from "vue";
import axios from "axios";
import { ContextFunction } from "../ContextFunction";

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
};

const mutations = {
  setBuyStocksApiStatus(state: State, data: any) {
    state.buyStocksApiStatus = data;
  },
  setSellStocksApiStatus(state: State, data: any) {
    state.sellStocksApiStatus = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
