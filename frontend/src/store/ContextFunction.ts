import { Commit, Dispatch } from "vuex";

export interface ContextFunction {
  commit: Commit;
  dispatch: Dispatch;
}

export interface ContextStateFunction<T> extends ContextFunction {
  state: T;
}
