import { InjectionKey, State } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import authModule from "./modules/auth";
import tradeModule from "./modules/trade";

export const key: InjectionKey<Store<State>> = Symbol();

// Create a new store instance.
export const store = createStore<State>({
  modules: {
    auth: authModule,
    trade: tradeModule,
  },
});

// define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}
