import { Commit } from "vuex";

export interface CommitFunction {
  commit: Commit;
}

export interface CommitStateFunction<T> extends CommitFunction {
  state: T;
}
