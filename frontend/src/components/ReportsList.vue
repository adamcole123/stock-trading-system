<template>
  <div>
    <h1>Reports</h1>

    <div v-if="getUserProfile.reports">
      <div v-for="report in getUserProfile.reports" :key="report.id">
        <a @click="saveReport(report)" class="report-link"
          >{{ moment(report.report_date).format("MMMM Do YYYY, h:mm:ss a") }}
          <b>{{ report.report_type }}</b></a
        >
      </div>
    </div>
    <div v-else>
      <p>No reports</p>
    </div>
    <router-link to="/generate-report">Generate Report</router-link>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";

export default defineComponent({
  name: "ReportsList",
  data: function () {
    return {
      moment: moment,
    };
  },
  computed: {
    ...mapGetters("auth", {
      getUserProfile: "getUserProfile",
    }),
  },
  methods: {
    ...mapActions("auth", {
      actionUserProfile: "userProfile",
    }),
    ...mapActions("report", {
      actionDownloadReport: "downloadReport",
    }),
    saveReport(report) {
      let payload = {
        report_id: report.id,
        user_id: this.getUserProfile.id,
        report_type: report.report_type,
      };
      this.actionDownloadReport(payload);
    },
  },
  created() {
    this.actionUserProfile();
  },
});
</script>
<style lang="scss">
.report-link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
