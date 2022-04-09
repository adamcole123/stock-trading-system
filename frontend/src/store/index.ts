import { InjectionKey, State } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import axios from "axios";

export const key: InjectionKey<Store<State>> = Symbol();

// Create a new store instance.
export const store = createStore<State>({
  state: {
    userData: {
      id: "",
      username: "",
      email: "",
      firstName: "",
      lastName: "",
    },
    token: "",
  },
  mutations: {
    updateUserData(state, newUserData) {
      state.userData = {
        firstName: newUserData.firstName,
        lastName: newUserData.lastName,
        id: newUserData.id,
        email: newUserData.email,
        credit: newUserData.credit,
        reports: newUserData.reports,
        cardDetails: newUserData.cardDetails,
        username: newUserData.username,
      };
    },
    updateToken(state, newToken) {
      state.token = newToken;
    },
  },
  actions: {
    validateUser({ commit, state }) {
      console.log(state.token);
      axios
        .post("http://localhost:8000/user/validate", {
          token: state.token,
        })
        .then((retreivedUserData) => {
          commit("updateUser", retreivedUserData);
        })
        .catch((error) => {
          console.log(error);
          console.log(state.token);
          commit("updateUserData", {
            firstName: "",
            lastName: "",
            id: "",
            email: "",
            credit: "",
            reports: [],
            username: "",
            cardDetails: [],
          });
          commit("updateToken", "");
        });
    },
  },
  getters: {
    userData: (state) => state.userData,
    token: (state) => state.token,
  },
});

// define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}
