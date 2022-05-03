import { State } from "vue";
import axios from "axios";
import { ContextFunction } from "../ContextFunction";

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
  async getStocksApi({ commit, dispatch }: ContextFunction, payload: any) {
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

  async updateStocksData({ commit, dispatch }: ContextFunction, payload: any) {
    const index = payload[1].findIndex((object: { id: number }) => {
      return object.id === payload[0].id;
    });

    if (index !== -1) {
      const newStockData = {
        ...payload[1][index],
        ...payload[0],
      };

      newStockData.gains = Number.parseFloat(
        (newStockData.value - newStockData.open).toFixed(2)
      );

      payload[1][index] = newStockData;
    }
    commit("setStockData", payload[1]);
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
