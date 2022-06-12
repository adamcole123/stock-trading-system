<template>
  <div>
    <h3>Companies</h3>
    <router-link to="/company/new">New</router-link>
    <table v-if="getStockData.length > 0">
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <div v-if="listLoaded">
          <tr v-for="company in getStockData" :key="company.id">
            <td>{{ company.symbol }}</td>
            <td>{{ company.name }}</td>
            <td>
              <router-link :to="{ path: 'company', query: { id: company.id } }"
                >View</router-link
              >
            </td>
          </tr>
        </div>
        <pulse-loader :color="spinnerColor" v-else></pulse-loader>
      </tbody>
    </table>
    <h3 v-else>No companies in system</h3>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

export default defineComponent({
  name: "CompanyAdminList",
  data() {
    return {
      listLoaded: false,
      spinnerColor: "#456ddb",
    };
  },
  components: {
    PulseLoader,
  },
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
    this.actionGetStocksApi({}).then(() => {
      this.listLoaded = true;
    });
  },
});
</script>
