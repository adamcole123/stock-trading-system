<template>
  <div class="report-modal">
    <div class="report-modal__body" v-if="getReportType === 3">
      <button @click="actionHideReportModal()">Close</button>
      <div class="report-modal__header">
        <h1>Generate Company Details Report</h1>
      </div>
      <div class="report-modal__body__content">
        <div class="report-modal__body__content__item">
          <table class="stocklist">
            <thead>
              <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stock in getStockData" :key="stock.id">
                <td>{{ stock.symbol }}</td>
                <td>{{ stock.name }}</td>
                <td>
                  <input
                    type="checkbox"
                    v-model="selectedStocks"
                    :value="stock.id"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <label for="ascending">Order value by ascending or descending?</label>
          <select name="ascending" id="ascending" v-model="ascending">
            <option value="true">Ascending</option>
            <option value="false">Descending</option>
          </select>

          <select
            name="report-format"
            id="report-format"
            v-model="report_format"
          >
            <option value="CSV">CSV</option>
            <option value="XML">XML</option>
          </select>

          <button
            @click="generateReport(`company-details`)"
            class="report-modal__body__content__item__button"
          >
            Complete Stock Values
          </button>
        </div>
      </div>
    </div>
    <div class="report-modal__body" v-if="getReportType === 2">
      <button @click="actionHideReportModal()">Close</button>
      <div class="report-modal__header">
        <h1>Generate Company Values Report</h1>
      </div>
      <div class="report-modal__body__content">
        <div class="report-modal__body__content__item">
          <label for="ascending">Order value by ascending or descending?</label>
          <select name="ascending" id="ascending" v-model="ascending">
            <option value="true">Ascending</option>
            <option value="false">Descending</option>
          </select>

          <select
            name="report-format"
            id="report-format"
            v-model="report_format"
          >
            <option value="CSV">CSV</option>
            <option value="XML">XML</option>
          </select>

          <button
            @click="generateReport(`company-values`)"
            class="report-modal__body__content__item__button"
          >
            Complete Stock Values
          </button>
        </div>
      </div>
    </div>
    <div class="report-modal__body" v-if="getReportType === 1">
      <button @click="actionHideReportModal()">Close</button>
      <div class="report-modal__header">
        <h1>Generate User Held Shares Report</h1>
      </div>
      <div class="report-modal__body__content">
        <div class="report-modal__body__content__item">
          <label for="ascending">Order value by ascending or descending?</label>
          <select name="ascending" id="ascending" v-model="ascending">
            <option value="true">Ascending</option>
            <option value="false">Descending</option>
          </select>

          <select
            name="report-format"
            id="report-format"
            v-model="report_format"
          >
            <option value="CSV">CSV</option>
            <option value="XML">XML</option>
          </select>

          <button
            @click="generateReport(`held-shares`)"
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
      report_format: 0,
      selectedStocks: [],
    };
  },
  computed: {
    ...mapGetters("report", {
      getReportModalVisible: "getReportModalVisible",
      getGenerateReportApiStatus: "getGenerateReportApiStatus",
      getReportType: "getReportType",
    }),
    ...mapGetters("stock", {
      getStockData: "getStockData",
    }),
  },
  created() {
    this.actionGetStocksApi();
  },
  methods: {
    ...mapActions("report", {
      actionGenerateReport: "generateReport",
      actionHideReportModal: "hideReportModal",
    }),
    ...mapActions("stock", {
      actionGetStocksApi: "getStocksApi",
    }),
    async generateReport(reportType: string) {
      console.log(this.report_format, this.ascending);
      let payload = {
        reportType: reportType,
        reportFormat: this.report_format,
        ascending: this.ascending,
        selectedStocks: this.selectedStocks,
      };
      await this.actionGenerateReport(payload);
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
.stocklist {
  height: 300px;
  max-height: 300px;
  overflow-y: scroll;
  display: block;
}
</style>
