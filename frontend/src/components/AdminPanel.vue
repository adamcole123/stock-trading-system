<template>
  <div class="admin-panel">
    <h2>Admin</h2>
    <br />
    <div class="lists">
      <UserAdminList class="user-admin-list" />
      <CompanyAdminList class="company-admin-list" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import UserAdminList from "./UserAdminList.vue";
import CompanyAdminList from "./CompanyAdminList.vue";

export default defineComponent({
  name: "AdminPanel",
  components: {
    UserAdminList,
    CompanyAdminList,
  },
});
</script>
<style lang="scss" scoped>
.admin-panel {
  width: 100%;
  margin: 0 auto;
}
.lists {
  display: flex;
  height: 300px;
}
.user-admin-list {
  flex-grow: 1;
  max-height: 100%;
  overflow-y: scroll;
}
.company-admin-list {
  flex-grow: 1;
  max-height: 100%;
  overflow-y: scroll;
}
</style>
