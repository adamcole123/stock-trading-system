import { State } from "vue";
import axios from "axios";
import { CommitFunction } from "../CommitFunction";

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
  async loginApi({ commit }: CommitFunction, payload: any) {
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
  async registerApi({ commit }: CommitFunction, payload: any) {
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
  async userProfile({ commit }: CommitFunction) {
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
      console.log(response);
      return response.data.message;
    }
  },
  async userLogout({ commit }: CommitFunction) {
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
      id: data.id,
      lastName: data.lastName,
      firstName: data.firstName,
      email: data.email,
      username: data.username,
      credit: data.credit,
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
