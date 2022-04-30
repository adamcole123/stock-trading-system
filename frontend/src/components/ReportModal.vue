<template>
  <div class="report-modal">
    <div class="report-modal__body">
      <button @click="actionHideReportModal()">Close</button>
      <div class="report-modal__header">
        <h1>Generate Report</h1>
      </div>
      <div class="report-modal__body__content">
        <div class="report-modal__body__content__item">
          <label for="ascending">Order value by ascending or descending?</label>
          <select name="ascending" id="ascending" v-model="ascending">
            <option value="true">Ascending</option>
            <option value="false">Descending</option>
          </select>

          <button
            @click="generateReport(1)"
            class="report-modal__body__content__item__button"
          >
            Complete Stock Values
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";

export default defineComponent({
  name: "ReportModal",
  data: function () {
    return {
      ascending: true,
    };
  },
  computed: {
    ...mapGetters("report", {
      getReportModalVisible: "getReportModalVisible",
      getGenerateReportApiStatus: "getGenerateReportApiStatus",
    }),
  },
  methods: {
    ...mapActions("report", {
      actionGenerateReport: "generateReport",
      actionHideReportModal: "hideReportModal",
    }),
    async generateReport(reportType: number) {
      let payload = {
        reportType: reportType,
        ascending: this.ascending,
      };
      await this.actionGenerateReport(reportType);
      if (this.getGenerateReportApiStatus == "success") {
        alert("Report generated successfully!");
        this.$router.push("/account");
      } else {
        alert("Report generation failed!");
      }
    },
  },
});
</script>
<style lang="scss">
.report-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}
.report-modal__body {
  width: 500px;
  height: auto;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  padding: 20px;
}
.report-modal__body__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.report-modal__body__content__item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.report-modal__body__content__item__button {
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: none;
  background-color: #00a8ff;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
</style>
