<template>
  <div>
    <h3>Users</h3>
    <table v-if="getAllUsers.length > 0">
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in getAllUsers" :key="user.id">
          <td>{{ user.username }}</td>
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>
            <router-link
              :to="{ path: 'user', query: { username: user.username } }"
              >View</router-link
            >
          </td>
        </tr>
      </tbody>
    </table>
    <h3 v-else>No users in system</h3>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "UserAdminList",
  computed: {
    ...mapGetters("admin", {
      getAllUsers: "getAllUsers",
    }),
  },
  methods: {
    ...mapActions("admin", {
      actionGetUsersApi: "getAllUsersApi",
    }),
  },
  created() {
    this.actionGetUsersApi();
  },
});
</script>
