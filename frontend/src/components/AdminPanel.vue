<template>
  <div>
    <h2>Admin</h2>
    <UserAdminList />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import UserAdminList from "./UserAdminList.vue";

export default defineComponent({
  name: "AdminPanel",
  components: {
    UserAdminList,
  },
});
</script>
