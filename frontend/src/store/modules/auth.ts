import { State } from "vue";
import axios from "axios";
import { ContextFunction } from "../ContextFunction";
import router from "../../router";
import { store } from "..";

const state = () => ({
  loginApiStatus: "",
  registerApiStatus: "",
  newCardApiStatus: "",
  logOut: false,
  userProfile: {
    firstName: "",
    lastName: "",
    email: "",
    id: "",
    username: "",
    reports: [],
  },
  activationApiStatus: "",
});

const getters = {
  getLoginApiStatus(state: State) {
    return state.loginApiStatus;
  },
  getRegisterApiStatus(state: State) {
    return state.registerApiStatus;
  },
  getPasswordResetRequestApiStatus(state: State) {
    return state.passwordResetRequestApiStatus;
  },
  getUserProfile(state: State) {
    return state.userProfile;
  },
  getLogout(state: State) {
    return state.logOut;
  },
  getActivationApiStatus(state: State) {
    return state.activationApiStatus;
  },
  getEditUserApiStatus(state: State) {
    return state.editUserApiStatus;
  },
};

const actions = {
  async passwordResetRequest(
    { commit, dispatch }: ContextFunction,
    payload: any
  ) {
    //Payload is structured like { email: emailaddress_string }
    const response = await axios
      .post("http://localhost:8000/user/password-reset-request", payload, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      commit("setPasswordResetRequestApiStatus", "success");
      router.push("/password-reset-granted");
    } else {
      commit("setPasswordResetRequestApiStatus", "failed");
      router.push("/password-reset-denied");
    }
  },
  async passwordReset({ commit, dispatch }: ContextFunction, payload: any) {
    //Payload is structured like
    // {
    //   key: key query param,
    //   password: password_string
    // }
    console.log("payload", payload);
    const response = await axios
      .post("http://localhost:8000/user/password-reset", payload, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      commit("setPasswordResetApiStatus", "success");
      const userProfile = store.getters["auth/getUserProfile"];
      alert("Password reset successfully");
      if (userProfile.id) {
        router.push("/account");
      } else {
        router.push("/login");
      }
    } else {
      commit("setPasswordResetApiStatus", "failed");
      alert("Password reset failed");
      const userProfile = store.getters["auth/getUserProfile"];
      if (userProfile.id) {
        router.push("/account");
      } else {
        router.push("/login");
      }
    }
  },
  async loginApi({ commit, dispatch }: ContextFunction, payload: any) {
    let error;
    const response = await axios
      .post("http://localhost:8000/user/signin", payload, {
        withCredentials: true,
      })
      .catch((err) => {
        if (err)
          error = err.response.data
            ? err.response.data
            : "Error logging in user";
      });

    if (response && response.data) {
      commit("setLoginApiStatus", "success");
      console.log(response);
      return response;
    } else {
      commit("setLoginApiStatus", "failed");
      return error;
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
        console.log(err);
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
  async addNewCard({ commit, dispatch }: ContextFunction, payload: any) {
    const response = await axios
      .post("http://localhost:8000/user/credit-card", payload, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      commit("setNewCardApiStatus", "success");
      return response.data.message;
    } else {
      commit("setNewCardApiStatus", "success");
    }
  },
  async activateAccount({ commit, dispatch }: ContextFunction, payload: any) {
    console.log(payload);
    const response = await axios
      .post("http://localhost:8000/user/activate", payload)
      .catch((err) => {
        console.log(err);
      });

    if (response && response.data) {
      commit("setActivationApiStatus", "success");
    } else {
      commit("setActivationApiStatus", "failed");
    }
  },
  async editUserDetails({ commit, dispatch }: ContextFunction, payload: any) {
    console.log(payload);
    const response = await axios
      .post("http://localhost:8000/user/edit", payload, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);
        return err.error;
      });

    if (response && response.data) {
      commit("setEditUserApiStatus", "success");
      return response.data;
    } else {
      commit("setEditUserApiStatus", "failed");
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
  setNewCardApiStatus(state: State, data: any) {
    state.newCardApiStatus = data;
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
  setActivationApiStatus(state: State, payload: any) {
    state.activationApiStatus = payload;
  },
  setEditUserApiStatus(state: State, payload: any) {
    state.editUserApiStatus = payload;
  },
  setPasswordResetRequestApiStatus(state: State, payload: any) {
    state.passwordResetRequestApiStatus = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
