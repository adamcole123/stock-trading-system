<template>
  <div>
    <AddNewCard
      v-if="showAddCard"
      @showAddCardModal="showAddCard = !showAddCard"
    />
    <div class="credit-confirm-modal">
      <div class="credit-confirm-modal__body">
        <button @click="hideCreditConfirmModal()">Close</button>
        <div class="credit-confirm-modal__header">
          <h1>Select your credit card</h1>
        </div>
        <div class="credit-confirm-modal__body__content">
          <select v-model="selectedCard">
            <option
              :value="card.id"
              v-for="card in getUserProfile.cardDetails"
              :key="card.id"
            >
              ************{{ card.cardNumber }}
            </option>
          </select>
          <button @click="showAddCardModal()">Add new card</button>
          <button v-if="tradeType == 'Buy'" @click="buyStocks()">
            Confirm
          </button>
          <button v-if="tradeType == 'Sell'" @click="sellStocks()">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import AddNewCard from "./AddNewCard.vue";

export default defineComponent({
  name: "CreditCardConfirm",
  data() {
    return {
      selectedCard: {},
      showAddCard: false,
    };
  },
  components: {
    AddNewCard,
  },
  props: ["tradeType", "stockId", "stockAmount"],
  computed: {
    ...mapGetters("auth", {
      getUserProfile: "getUserProfile",
    }),
    ...mapGetters("trade", {
      getBuyStocksApiStatus: "getBuyStocksApiStatus",
      getSellStocksApiStatus: "getSellStocksApiStatus",
    }),
  },
  methods: {
    ...mapActions("trade", {
      actionBuyStocksApi: "buyStocksApi",
      actionSellStocksApi: "sellStocksApi",
    }),
    async buyStocks() {
      const payload = {
        stock_id: this.stockId,
        user_id: this.getUserProfile.id,
        stock_amount: this.stockAmount,
      };
      await this.actionBuyStocksApi(payload);
      if (this.getBuyStocksApiStatus == "success") {
        alert("Buy trade successfully!");
        this.hideCreditConfirmModal();
      } else {
        alert("Buy trade failed!");
        this.hideCreditConfirmModal();
      }
    },
    async sellStocks() {
      const payload = {
        stock_id: this.stockId,
        user_id: this.getUserProfile.id,
        stock_amount: this.stockAmount,
      };
      await this.actionSellStocksApi(payload);
      if (this.getSellStocksApiStatus == "success") {
        alert("Sell trade successfully!");
        this.hideCreditConfirmModal();
      } else {
        alert("Sell trade failed!");
        this.hideCreditConfirmModal();
      }
    },
    hideCreditConfirmModal() {
      this.$emit("showHideCardConfirm");
    },
    async showAddCardModal() {
      this.showAddCard = true;
    },
  },
});
</script>
<style scoped>
.credit-confirm-modal {
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
.credit-confirm-modal__body {
  width: 500px;
  height: auto;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  padding: 20px;
}
.credit-confirm-modal__body__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.credit-confirm-modal__body__content__item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.credit-confirm-modal__body__content__item__button {
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
