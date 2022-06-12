<template>
  <div>
    <NavBar />
    <Transition>
      <Suspense>
        <div>
          <router-view class="content" v-if="$route.path !== '/'"></router-view>
          <router-view class="home" v-else></router-view>
        </div>
        <template #fallback>
          <PulseLoader></PulseLoader>
        </template>
      </Suspense>
    </Transition>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "./components/NavBar.vue";
import { mapGetters } from "vuex";
import PulseLoader from "../node_modules/vue-spinner/src/PulseLoader.vue";

export default defineComponent({
  name: "App",
  data() {
    return {
      spinnerColor: "#456ddb",
    };
  },
  components: { NavBar, PulseLoader },
  computed: {
    ...mapGetters("auth", {
      getUserProfile: "getUserProfile",
    }),
  },
});
</script>

<style>
.navbar {
  --bg: #172a3a;
  display: flex;
  justify-content: space-between;
  padding: 20px 20px;
  color: #e6ffff;
  background-color: var(--bg);
}
.left,
.right {
  display: flex;
  align-items: center;
}
.left {
  margin-left: 20px;
}
.right {
  margin-right: 20px;
}
.nav-link {
  color: #e6ffff;
  margin: 0 10px;
  text-decoration: none;
  cursor: pointer;
}
body {
  background-color: #e6ffff;
  margin: 0;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  accent-color: #172a3a;
}
.content {
  width: 60%;
  margin: 0 auto;
  padding: 20px;
}
.home {
  width: 80%;
  margin: 0 auto;
}
.content,
.home {
  --bgmain: #e6ffff;
  background-color: var(--bgmain);
  color: color-contrast(var(--bgmain), vs white, black);
}
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form > input {
  margin-bottom: 20px;
}

.edit-screen {
  width: 40%;
  margin: 0 auto;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.breadcrumb {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
