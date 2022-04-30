import { State } from "vue";
import axios from "axios";
import { ContextFunction } from "../ContextFunction";

const state = () => ({
  reportType: 0,
  reportModalVisible: false,
  generateReportApiStatus: "",
});

const getters = {
  getReportModalVisible(state: State) {
    return state.reportModalVisible;
  },
  getReportType(state: State) {
    return state.reportType;
  },
  getGenerateReportApiStatus(state: State) {
    return state.generateReportApiStatus;
  },
};

const actions = {
  async showReportModal({ commit, dispatch }: ContextFunction, payload: any) {
    commit("setReportModalVisible", true);
    commit("setReportType", payload.reportType);
  },
  async hideReportModal({ commit, dispatch }: ContextFunction, payload: any) {
    commit("setReportModalVisible", false);
  },
  async generateReport({ commit, dispatch }: ContextFunction, payload: any) {
    const response = await axios
      .get(
        `http://localhost:8000/report/company-values?report-type=${payload.reportType}&ascending=${payload.ascending}`,
        {
          withCredentials: true,
        }
      )
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      commit("setGenerateReportApiStatus", "success");
      commit("setUserProfile", response.data);
    } else {
      commit("setGenerateReportApiStatus", "failed");
    }
  },
};

const mutations = {
  setReportModalVisible(state: State, data: any) {
    state.reportModalVisible = data;
  },
  setReportType(state: State, data: any) {
    state.reportType = data;
  },
  setGenerateReportApiStatus(state: State, data: any) {
    state.generateReportApiStatus = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
