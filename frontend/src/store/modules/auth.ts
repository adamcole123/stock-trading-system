import { State } from "vue";
import axios from "axios";
import { CommitFunction } from "../CommitFunction";

const state = () => ({
  loginApiStatus: "",
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
  async userProfile({ commit }: CommitFunction) {
    const response = await axios
      .post("http://localhost:8000/user/validate", undefined, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err.message);
      });

    console.log(response);

    if (response && response.data) {
      commit("setUserProfile", response.data.signedInUserDto);
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
  setUserProfile(state: State, data: any) {
    const userProfile = {
      id: data._id,
      lastName: data.lastName,
      firstName: data.firstName,
      email: data.email,
      username: data.username,
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
