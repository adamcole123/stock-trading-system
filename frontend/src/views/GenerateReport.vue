<template>
  <div>
    <ReportModal v-if="getReportModalVisible" />
    <h1>Generate Reports</h1>
    <h3>Select which report to generate:</h3>
    <button @click="actionShowReportModal({ reportType: 1 })">
      User Held Shares
    </button>
    <button @click="actionShowReportModal({ reportType: 2 })">
      Complete Stock Values
    </button>
    <button @click="actionShowReportModal({ reportType: 3 })">
      Selected Company Details
    </button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import ReportModal from "../components/ReportModal.vue";

export default defineComponent({
  name: "GenerateReport",
  data: function () {
    return {};
  },
  components: {
    ReportModal,
  },
  computed: {
    ...mapGetters("report", {
      getReportModalVisible: "getReportModalVisible",
    }),
  },
  methods: {
    ...mapActions("report", {
      actionShowReportModal: "showReportModal",
    }),
  },
});
</script>
