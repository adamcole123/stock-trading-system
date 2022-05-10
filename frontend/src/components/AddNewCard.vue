<template>
  <div>
    <div class="new-card-modal">
      <div class="new-card-modal__body">
        <button @click="hideAddNewCardModal()">Close</button>
        <div class="new-card-modal__header">
          <h1>Enter card details</h1>
        </div>
        <div class="new-card-modal__body__content">
          <div class="new-card-modal__body__content__form">
            <div class="new-card-modal__body__content__form__item">
              <label>Card number</label>
              <input
                type="text"
                placeholder="Enter card number"
                v-model="cardDetails.cardNumber"
              />
            </div>
            <div class="new-card-modal__body__content__form__item">
              <label>Expiry date</label>
              <input
                type="text"
                placeholder="Enter expiry date"
                v-model="cardDetails.expiryDate"
              />
            </div>
            <div class="new-card-modal__body__content__form__item">
              <label>CVV</label>
              <input
                type="text"
                placeholder="Enter CVV"
                v-model="cardDetails.cvv"
              />
            </div>
            <div class="new-card-modal__body__content__form__item">
              <label>Name on card</label>
              <input
                type="text"
                placeholder="Enter name on card"
                v-model="cardDetails.nameOnCard"
              />
            </div>
            <div class="new-card-modal__body__content__form__item">
              <label>Address Line 1</label>
              <input
                type="text"
                placeholder="Enter address"
                v-model="cardDetails.addressLine1"
              />
            </div>
            <div class="new-card-modal__body__content__form__item">
              <label>City</label>
              <input
                type="text"
                placeholder="Enter city"
                v-model="cardDetails.city"
              />
            </div>
            <div class="new-card-modal__body__content__form__item">
              <label>County</label>
              <input
                type="text"
                placeholder="Enter state"
                v-model="cardDetails.county"
              />
            </div>
            <div class="new-card-modal__body__content__form__item">
              <label>Postcode</label>
              <input
                type="text"
                placeholder="Enter zip code"
                v-model="cardDetails.postcode"
              />
            </div>
            <div class="new-card-modal__body__content__form__item">
              <label>Country</label>
              <input
                type="text"
                placeholder="Enter country"
                v-model="cardDetails.country"
              />
            </div>
            <button @click="addNewCard()">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "AddNewCard",
  data() {
    return {
      cardDetails: {
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        nameOnCard: "",
        addressLine1: "",
        city: "",
        county: "",
        postcode: "",
        country: "",
      },
    };
  },
  methods: {
    ...mapActions("auth", {
      actionAddNewCard: "addNewCard",
      actionUserProfile: "userProfile",
    }),
    hideAddNewCardModal() {
      this.$emit("showAddCardModal");
    },
    async addNewCard() {
      let payload = {
        cardDetails: this.cardDetails,
        userId: this.getUserProfile.id,
      };
      await this.actionAddNewCard(payload);
      await this.actionUserProfile();
      this.hideAddNewCardModal();
    },
  },
  computed: {
    ...mapGetters("auth", {
      getUserProfile: "getUserProfile",
    }),
  },
});
</script>
<style lang="scss">
.new-card-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 101;
  display: flex;
  justify-content: center;
  align-items: center;
}
.new-card-modal__body {
  width: 500px;
  height: auto;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  padding: 20px;
}
.new-card-modal__body__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.new-card-modal__body__content__item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.new-card-modal__body__content__item__button {
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
.new-card-modal__body__content__form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.new-card-modal__body__content__form__item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.new-card-modal__body__content__form__item__label {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}
.new-card-modal__body__content__form__item__input {
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: none;
  padding: 0 10px;
  font-size: 16px;
  font-weight: bold;
}
.new-card-modal__body__content__form__item__button {
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
.new-card-modal__body__content__form__item__button:hover {
  background-color: #00a8ff;
}
.new-card-modal__header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.new-card-modal__header__title {
  font-size: 20px;
  font-weight: bold;
  margin-right: 10px;
}
</style>
