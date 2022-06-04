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
  getNewCompanyApiStatus(state: State) {
    return state.newCompanyApiStatus;
  },
};

const actions = {
  async getStocksApi({ commit, dispatch }: ContextFunction, payload: any) {
    console.log(payload);
    payload = {
      filters: {
        symbol: payload.symbol,
        name: payload.name,
        value: payload.value,
        volume: payload.volume,
        open: payload.open,
        close: payload.close,
        gains: payload.gains,
      },
      options: {
        page: payload.page,
        limit: payload.limit,
        order:
          payload.orderBy === undefined || payload.orderDirection === undefined
            ? undefined
            : {
                orderBy: payload.orderBy,
                orderDirection: payload.orderDirection,
              },
      },
    };

    console.log("payload", payload);

    const response = await axios
      .post("http://localhost:8000/stock/getMany", payload, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
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

  async newCompany({ commit, dispatch }: ContextFunction, payload: any) {
    const response = await axios
      .post("http://localhost:8000/stock/create", payload, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      commit("setNewCompanyApiStatus", "success");
    } else {
      commit("setNewCompanyApiStatus", "failed");
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
  setNewCompanyApiStatus(state: State, data: any) {
    state.newCompanyApiStatus = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
