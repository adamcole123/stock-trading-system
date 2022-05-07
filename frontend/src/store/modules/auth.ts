import { State } from "vue";
import axios from "axios";
import { ContextFunction } from "../ContextFunction";

const state = () => ({
  loginApiStatus: "",
  registerApiStatus: "",
  logOut: false,
  userProfile: {
    firstName: "",
    lastName: "",
    email: "",
    id: "",
    username: "",
    reports: [],
  },
});

const getters = {
  getLoginApiStatus(state: State) {
    return state.loginApiStatus;
  },
  getRegisterApiStatus(state: State) {
    return state.registerApiStatus;
  },
  getUserProfile(state: State) {
    return state.userProfile;
  },
  getLogout(state: State) {
    return state.logOut;
  },
};

const actions = {
  async loginApi({ commit, dispatch }: ContextFunction, payload: any) {
    const response = await axios
      .post("http://localhost:8000/user/signin", payload, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      commit("setLoginApiStatus", "success");
    } else {
      commit("setLoginApiStatus", "failed");
    }
  },
  async registerApi({ commit, dispatch }: ContextFunction, payload: any) {
    console.log(payload);
    const response = await axios
      .post("http://localhost:8000/user/register", payload, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
        return err.error;
      });

    if (response && response.data) {
      commit("setRegisterApiStatus", "success");
      return response.data.message;
    } else {
      commit("setRegisterApiStatus", "failed");
    }
  },
  async userProfile({ commit, dispatch }: ContextFunction) {
    const response = await axios
      .post("http://localhost:8000/user/validate", undefined, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err.message);
        return err.error;
      });

    if (response && response.data) {
      commit("setUserProfile", response.data);
      return response.data.message;
    }
  },
  async userLogout({ commit, dispatch }: ContextFunction) {
    const response = await axios
      .get("http://localhost:8000/user/signout", {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      commit("setLogout", true);
    } else {
      commit("setLogout", false);
    }
  },
};

const mutations = {
  setLoginApiStatus(state: State, data: any) {
    state.loginApiStatus = data;
  },
  setRegisterApiStatus(state: State, data: any) {
    state.registerApiStatus = data;
  },
  setUserProfile(state: State, data: any) {
    const userProfile = {
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: data.birthDate,
      reports: data.reports,
      id: data.id,
      credit: data.credit,
      role: data.role,
      cardDetails: data.cardDetails,
    };
    state.userProfile = userProfile;
  },
  setLogout(state: State, payload: any) {
    state.logOut = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
