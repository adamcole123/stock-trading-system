import { State } from "vue";
import axios from "axios";
import { ContextFunction } from "../ContextFunction";

const state = () => ({
  getStocksApiStatus: "",
  editStockApiStatus: "",
  stockData: [],
});

const getters = {
  getGetStocksApiStatus(state: State) {
    return state.getStocksApiStatus;
  },
  getStockData(state: State) {
    return state.stockData;
  },
  getEditCompanyApiStatus(state: State) {
    return state.editCompanyApiStatus;
  },
};

const actions = {
  async getStocksApi({ commit, dispatch }: ContextFunction, payload: any) {
    console.log(payload);
    payload = {
      page: payload.page,
      limit: payload.limit,
    };
    const response = await axios({
      method: "get",
      url: `http://localhost:8000/stock/getMany?page=${
        payload.page ? payload.page : ""
      }&limit=${payload.limit ? payload.limit : ""}`,
    });

    if (response && response.data) {
      console.log(response);
      commit("setStockData", response.data);
      commit("setGetStocksApiStatus", "success");
    } else {
      commit("setGetStocksApiStatus", "failed");
    }
  },

  async getCompanyDetailsApi(
    { commit, dispatch }: ContextFunction,
    payload: any
  ) {
    const response = await axios({
      method: "get",
      url: `http://localhost:8000/stock/getOne?id=${payload.id}`,
    });

    if (response && response.data) {
      return response.data;
      commit("setGetCompanyDetailsApiStatus", "success");
    } else {
      commit("setGetCompanyDetailsApiStatus", "failed");
    }
  },

  async editCompanyDetails(
    { commit, dispatch }: ContextFunction,
    payload: any
  ) {
    const response = await axios
      .post("http://localhost:8000/stock/edit", payload, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      commit("setEditCompanyApiStatus", "success");
    } else {
      commit("setEditCompanyApiStatus", "failed");
    }
  },

  async updateStocksData({ commit, dispatch }: ContextFunction, payload: any) {
    payload[0].forEach((update: { id: number }) => {
      const index = payload[1].findIndex((object: { id: number }) => {
        return object.id === update.id;
      });

      if (index !== -1) {
        const newStockData = {
          ...payload[1][index],
          ...update,
        };

        newStockData.gains = Number.parseFloat(
          (newStockData.value - newStockData.open).toFixed(2)
        );

        payload[1][index] = newStockData;
      }
      commit("setStockData", payload[1]);
    });
  },
};

const mutations = {
  setStockData(state: State, data: any) {
    state.stockData = data;
  },
  setGetStocksApiStatus(state: State, data: any) {
    state.getStocksApiStatus = data;
  },
  setGetCompanyDetailsApiStatus(state: State, data: any) {
    state.getCompanyDetailsApiStatus = data;
  },
  setEditCompanyApiStatus(state: State, data: any) {
    state.editCompanyApiStatus = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
