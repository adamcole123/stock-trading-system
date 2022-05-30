import { State } from "vue";
import axios from "axios";
import { ContextFunction } from "../ContextFunction";
import { store } from "..";

const state = () => ({
  allUsers: [],
});

const getters = {
  getAllUsers(state: State) {
    return state.allUsers;
  },
  getMakeUserBrokerApiStatus(state: State) {
    return state.makeUserBrokerApiStatus;
  },
};

const actions = {
  async getAllUsersApi({ commit, dispatch }: ContextFunction, payload: any) {
    const response = await axios
      .post("http://localhost:8000/user/all", payload, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      commit("setGetAllUsersApiStatus", "success");
      commit("setAllUsers", response.data);
    } else {
      commit("setGetAllUsersApiStatus", "failed");
    }
  },
  async getUserDetailsApi({ commit, dispatch }: ContextFunction, payload: any) {
    const response = await axios
      .get(`http://localhost:8000/user/one?username=${payload.username}`, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      console.log(response.data);
      commit("setGetUserDetailsApiStatus", "success");
      return response.data;
    } else {
      commit("setGetUserDetailsApiStatus", "failed");
    }
  },
  async makeUserBrokerApi({ commit, dispatch }: ContextFunction, payload: any) {
    const response = await axios
      .post("http://localhost:8000/user/edit", payload, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
        return err.error;
      });

    if (response && response.data) {
      console.log(response.data);
      commit("setMakeUserBrokerApiStatus", "success");
      return response.data;
    } else {
      commit("setMakeUserBrokerApiStatus", "failed");
    }
  },
};

const mutations = {
  setAllUsers(state: State, data: any) {
    state.allUsers = data;
  },
  setGetUserDetailsApiStatus(state: State, data: any) {
    state.getUserDetailsApiStatus = data;
  },
  setGetAllUsersApiStatus(state: State, data: any) {
    state.getAllUsersApiStatus = data;
  },
  setMakeUserBrokerApiStatus(state: State, data: any) {
    state.makeUserBrokerApiStatus = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
