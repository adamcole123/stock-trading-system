import { State } from "vue";
import axios from "axios";
import { CommitFunction } from "../CommitFunction";

const state = () => ({
  getStocksApiStatus: "",
  stockData: [],
});

const getters = {
  getGetStocksApiStatus(state: State) {
    return state.getStocksApiStatus;
  },
  getStockData(state: State) {
    return state.stockData;
  },
};

const actions = {
  async getStocksApi({ commit }: CommitFunction, payload: any) {
    const response = await axios({
      method: "get",
      url: "http://localhost:8000/stock/getMany?page=1",
    });

    if (response && response.data) {
      console.log(response);
      commit("setStockData", response.data);
      commit("setGetStocksApiStatus", "success");
    } else {
      commit("setGetStocksApiStatus", "failed");
    }
  },
};

const mutations = {
  setStockData(state: State, data: any) {
    state.stockData = data;
  },
  setGetStocksApiStatus(state: State, data: any) {
    state.getStocksApiStatus = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
