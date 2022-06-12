<template>
  <div class="new-company-screen">
    <div class="breadcrumb">
      <router-link to="/account">Back to account</router-link>
    </div>
    <h1>New Company Details</h1>
    <div class="form-group">
      <label>Company Name</label>
      <input v-model="company.name" />
    </div>
    <div class="form-group">
      <label>Company Symbol</label>
      <input
        v-model="company.symbol"
        onkeyup="this.value = this.value.toUpperCase();"
      />
    </div>
    <button class="btn btn-primary" @click="createCompany">Save</button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "NewCompanyView",
  data() {
    return {
      company: {
        name: "",
        symbol: "",
      },
    };
  },
  computed: {
    ...mapGetters("stock", {
      getNewCompanyApiStatus: "getNewCompanyApiStatus",
    }),
  },
  methods: {
    ...mapActions("stock", {
      actionNewCompanyApi: "newCompany",
    }),
    async createCompany() {
      await this.actionNewCompanyApi(this.company);

      if (this.getNewCompanyApiStatus === "success") {
        this.$router.push("/account");
        alert("Company created successfully");
      }
    },
  },
});
</script>
<style>
.new-company-screen {
  width: 60%;
  margin: 0 auto;
}
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
}
</style>
