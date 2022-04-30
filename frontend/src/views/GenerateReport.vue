<template>
  <div>
    <ReportModal v-if="getReportModalVisible" />

    <button @click="actionShowReportModal({ reportType: 1 })">
      Complete Stock Values
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
