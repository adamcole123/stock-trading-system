<template>
  <div>
    <table class="stocklist">
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th align="left">Gains</th>
          <th align="left">Value</th>
          <th align="left">Volume</th>
          <th align="left">Open</th>
          <th align="left">Clos</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stock in stocks" :key="stock.id">
          <td>{{ stock.symbol }}</td>
          <td>{{ stock.name }}</td>
          <td v-if="stock.gains! > 0" style="color: green">
            {{ stock.gains }}
          </td>
          <td v-else style="color: red">{{ stock.gains }}</td>
          <td>{{ stock.value }}</td>
          <td>{{ stock.volume }}</td>
          <td>{{ stock.open }}</td>
          <td>{{ stock.close }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import Stock from "../types/Stock";

export default defineComponent({
  name: "StockList",
  data() {
    return {
      stocks: [] as Stock[],
    };
  },
  created() {
    axios({
      method: "get",
      url: "http://localhost:8000/stock/getMany",
      headers: {},
      data: {
        options: {
          page: 1,
        }, // This is the body part
      },
    }).then((response) => {
      console.table(response);
      this.stocks = response.data;
    });
  },
});
</script>
<style>
.stocklist {
  width: 100%;
  border-collapse: collapse;
}
</style>
