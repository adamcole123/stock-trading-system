<template>
  <div>
    <NavBar />
    <router-view class="content" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "./components/NavBar.vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "App",
  components: { NavBar },
  computed: {
    ...mapGetters("auth", {
      getUserProfile: "getUserProfile",
    }),
  },
});
</script>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 20px 20px;
  background-color: #456ddb;
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
  color: #333;
  margin: 0 10px;
  text-decoration: none;
  cursor: pointer;
}
body {
  background-color: #f5f5f5;
  margin: 0;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
.content {
  padding: 20px;
}
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form > input {
  margin-bottom: 20px;
}
</style>
