import { State } from "vue";
import axios from "axios";
import { ContextFunction } from "../ContextFunction";

const state = () => ({
  reportType: 0,
  reportModalVisible: false,
  generateReportApiStatus: "",
  downloadReportApiStatus: "",
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
  getDownloadReportApiStatus(state: State) {
    return state.downloadReportApiStatus;
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
        `http://localhost:8000/report/company-values?reporttype=${payload.reportType}&ascending=${payload.ascending}`,
        {
          withCredentials: true,
        }
      )
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      commit("setGenerateReportApiStatus", "success");
      commit("auth/setUserProfile", response.data, { root: true });
    } else {
      commit("setGenerateReportApiStatus", "failed");
    }
  },
  async downloadReport({ commit, dispatch }: ContextFunction, payload: any) {
    const response = await axios
      .get(
        `http://localhost:8000/report/download?report_id=${payload.report_id}&user_id=${payload.user_id}`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      )
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `new_report.${String(payload.report_type).toLowerCase()}`
      );
      document.body.appendChild(link);
      link.click();
      commit("setDownloadReportApiStatus", "success");
    } else {
      commit("setDownloadReportApiStatus", "failed");
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
  setDownloadReportApiStatus(state: State, data: any) {
    state.downloadReportApiStatus = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
