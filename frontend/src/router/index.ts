import { store } from "@/store";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiredAuth: false },
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    meta: { requiredAuth: false },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginScreen.vue"),
    meta: { requiredAuth: false },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/RegisterScreen.vue"),
    meta: { requiredAuth: false },
  },
  {
    path: "/account",
    name: "account",
    component: () => import("../views/AccountView.vue"),
    meta: { requiredAuth: true },
  },
  {
    path: "/account/edit",
    name: "editAccount",
    component: () => import("../views/EditAccountView.vue"),
    meta: { requiredAuth: true },
  },
  {
    path: "/password-reset-granted",
    name: "passwordResetGranted",
    component: () => import("../views/PasswordResetGrantedView.vue"),
  },
  {
    path: "/password-reset-denied",
    name: "passwordResetDenied",
    component: () => import("../views/PasswordResetDeniedView.vue"),
  },
  {
    path: "/password-reset",
    name: "passwordResetDenied",
    component: () => import("../views/PasswordResetView.vue"),
  },
  {
    path: "/password-reset-request",
    name: "passwordResetRequest",
    component: () => import("../views/PasswordResetRequestView.vue"),
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("../views/ContactView.vue"),
    meta: { requiredAuth: false },
  },
  {
    path: "/generate-report",
    name: "generate-report",
    component: () => import("../views/GenerateReport.vue"),
    meta: { requiredAuth: true },
  },
  {
    path: "/activate",
    name: "activate",
    component: () => import("../views/ActivationView.vue"),
  },
  {
    path: "/user",
    name: "user",
    component: () => import("../views/EditUserView.vue"),
    meta: { requiredAuth: true },
  },
  {
    path: "/company",
    name: "editCompany",
    component: () => import("../views/EditCompanyView.vue"),
    meta: { requiredAuth: true, limitedTo: ["Admin"] },
  },
  {
    path: "/company/new",
    name: "newCompany",
    component: () => import("../views/NewCompanyView.vue"),
    meta: { requiredAuth: true, limitedTo: ["Admin"] },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  await store.dispatch("auth/userProfile");
  if (to.meta.requiredAuth) {
    let userProfile = store.getters["auth/getUserProfile"];
    const limitedTo = <string[]>to.meta.limitedTo;
    if (limitedTo) {
      if (limitedTo.findIndex((role) => role === userProfile.role) === -1) {
        await store.dispatch("auth/userLogout");
        await store.commit("auth/setUserProfile", {});
        return next({ path: "/login" });
      }
    }
    if (userProfile.id === "") {
      userProfile = store.getters["auth/getUserProfile"];
      if (userProfile.id === "") {
        store.dispatch("auth/userLogout");
        await store.commit("auth/setUserProfile", {});
        return next({ path: "/login" });
      } else {
        return next();
      }
    }
  }
  return next();
});

export default router;
