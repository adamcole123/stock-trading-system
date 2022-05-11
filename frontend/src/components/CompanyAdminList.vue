<template>
  <div>
    <h3>Companies</h3>
    <table v-if="getStockData.length > 0">
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="company in getStockData" :key="company.id">
          <td>{{ company.symbol }}</td>
          <td>{{ company.name }}</td>
          <td>
            <router-link :to="{ path: 'company', query: { id: company.id } }"
              >View</router-link
            >
          </td>
        </tr>
      </tbody>
    </table>
    <h3 v-else>No companies in system</h3>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "CompanyAdminList",
  computed: {
    ...mapGetters("stock", {
      getStockData: "getStockData",
    }),
  },
  methods: {
    ...mapActions("stock", {
      actionGetStocksApi: "getStocksApi",
    }),
  },
  created() {
    this.actionGetStocksApi({});
  },
});
</script>
