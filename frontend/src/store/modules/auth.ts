import { State } from "vue";
import axios from "axios";
import { CommitFunction } from "../CommitFunction";

const state = () => ({
  loginApiStatus: "",
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
  getUserProfile(state: State) {
    return state.userProfile;
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
  async userProfile({ commit }: CommitFunction) {
    const response = await axios
      .get("http://localhost:8000/user/validate", { withCredentials: true })
      .catch((err) => {
        console.log(err);
      });

    console.log(response);

    if (response && response.data) {
      commit("setUserProfile", response.data);
    }
  },
};

const mutations = {
  setLoginApiStatus(state: State, data: any) {
    state.loginApiStatus = data;
  },
  setUserProfile(state: State, data: any) {
    const userProfile = {
      id: data.id,
      lastName: data.lastName,
      firstName: data.firstName,
      email: data.email,
      username: data.username,
    };
    state.userProfile = userProfile;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
