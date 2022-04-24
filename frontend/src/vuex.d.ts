// vuex.d.ts
import { Store } from "@/vuex";
import User from "./types/User";

declare module "@vue/runtime-core" {
  // declare your own store states
  interface State {
    loginApiStatus: "";
    userProfile: User;
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
