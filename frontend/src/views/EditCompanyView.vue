<template>
  <div class="edit-screen">
    <h1>Edit Company Details</h1>
    <div class="form-group" v-for="key in Object.keys(company)" :key="key">
      <label>{{ splitCamelCaseOriginal(key) }}</label>
      <input v-model="company[key]" />
    </div>
    <button class="btn btn-primary" @click="updateCompany">Save</button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "EditCompanyView",
  data() {
    return {
      company: {} as { [key: string]: any },
    };
  },
  computed: {
    ...mapGetters("stock", {
      getEditCompanyApiStatus: "getEditCompanyApiStatus",
    }),
  },
  methods: {
    ...mapActions("stock", {
      actionEditCompanyDetailsApi: "editCompanyDetails",
    }),
    ...mapActions("stock", {
      actionGetCompanyDetailsApi: "getCompanyDetailsApi",
    }),
    splitCamelCaseOriginal(camelCaseString: string) {
      const result = camelCaseString
        .replace(/([A-Z][a-z])/g, " $1")
        .replace(/([A-Z]+)/g, " $1")
        .replace(/ +/g, " ")
        .replace(/^ +/g, "");

      return result.charAt(0).toUpperCase() + result.slice(1);
    },
    async updateCompany() {
      await this.actionEditCompanyDetailsApi(this.company);

      if (this.getEditCompanyApiStatus === "success") {
        await this.actionGetCompanyDetailsApi({ id: this.company.id });
        alert("Company details updated successfully");
      } else {
        alert("Could not edit company");
      }
    },
  },
  created() {
    this.actionGetCompanyDetailsApi({
      id: this.$route.query.id,
    })
      .then((company) => {
        this.company = company;
      })
      .catch(() => {
        alert("Could not get company details");
      });
  },
});
</script>
<style>
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
