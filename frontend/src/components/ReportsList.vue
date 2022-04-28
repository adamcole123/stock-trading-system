<template>
  <div>
    <h1>Reports</h1>

    <div v-if="getUserProfile.reports">
      <div v-for="report in getUserProfile.reports" :key="report.id">
        <a>{{
          moment(report.report_date).format("MMMM Do YYYY, h:mm:ss a")
        }}</a>
      </div>
    </div>
    <div v-else>
      <p>No reports</p>
    </div>
    <a>Generate Report</a>
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
  },
  created() {
    this.actionUserProfile();
  },
});
</script>
