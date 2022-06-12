<template>
  <div>
    <div class="new-card-modal">
      <div class="new-card-modal__body">
        <button @click="hideAddNewCardModal()">Close</button>
        <div class="new-card-modal__header">
          <h1>Enter card details</h1>
        </div>
        <form @submit.prevent="addNewCard()">
          <div class="new-card-modal__body__content">
            <div class="new-card-modal__body__content__form">
              <div class="new-card-modal__body__content__form__item">
                <label>Card number</label>
                <input
                  type="text"
                  placeholder="Enter card number"
                  v-model="cardDetails.cardNumber"
                  maxlength="16"
                  minlength="16"
                  required
                />
              </div>
              <div class="new-card-modal__body__content__form__item">
                <label>Expiry date</label>
                <input
                  type="text"
                  placeholder="Enter expiry date"
                  v-model="cardDetails.expiryDate"
                  pattern="^(0[1-9]|1[0-2])\/([0-9]{2})$"
                  oninvalid="this.setCustomValidity('This must be in the format MM/YY')"
                  onchange="try{setCustomValidity('')}catch(e){}"
                  oninput="setCustomValidity(' ')"
                  required
                />
              </div>
              <div class="new-card-modal__body__content__form__item">
                <label>CVV</label>
                <input
                  type="number"
                  placeholder="Enter CVV"
                  v-model="cardDetails.cvv"
                  max="999"
                  min="000"
                  pattern="[0-9]{3}"
                  oninvalid="this.setCustomValidity('This must only contain 3 numbers')"
                  onchange="try{setCustomValidity('')}catch(e){}"
                  oninput="setCustomValidity(' ')"
                  required
                />
              </div>
              <div class="new-card-modal__body__content__form__item">
                <label>Name on card</label>
                <input
                  type="text"
                  placeholder="Enter name on card"
                  v-model="cardDetails.nameOnCard"
                  pattern="([a-zA-Z]|\s|\.)+"
                  oninvalid="this.setCustomValidity('This must only contain letters or spaces')"
                  onchange="try{setCustomValidity('')}catch(e){}"
                  oninput="setCustomValidity(' ')"
                  required
                />
              </div>
              <div class="new-card-modal__body__content__form__item">
                <label>Address Line 1</label>
                <input
                  type="text"
                  placeholder="Enter address"
                  v-model="cardDetails.addressLine1"
                  pattern="([0-9a-zA-Z]|\s|\.)+"
                  oninvalid="this.setCustomValidity('This must only contain letters, spaced, or numbers')"
                  onchange="try{setCustomValidity('')}catch(e){}"
                  oninput="setCustomValidity(' ')"
                  required
                />
              </div>
              <div class="new-card-modal__body__content__form__item">
                <label>City</label>
                <input
                  type="text"
                  placeholder="Enter city"
                  v-model="cardDetails.city"
                  pattern="([a-zA-Z]|\s|\.)+"
                  oninvalid="this.setCustomValidity('This must only contain letters or spaces')"
                  onchange="try{setCustomValidity('')}catch(e){}"
                  oninput="setCustomValidity(' ')"
                  required
                />
              </div>
              <div class="new-card-modal__body__content__form__item">
                <label>County</label>
                <input
                  type="text"
                  placeholder="Enter state"
                  v-model="cardDetails.county"
                  pattern="([a-zA-Z]|\s|\.)+"
                  oninvalid="this.setCustomValidity('This must only contain letters or spaces')"
                  onchange="try{setCustomValidity('')}catch(e){}"
                  oninput="setCustomValidity(' ')"
                  required
                />
              </div>
              <div class="new-card-modal__body__content__form__item">
                <label>Postcode</label>
                <input
                  type="text"
                  placeholder="Enter zip code"
                  v-model="cardDetails.postcode"
                  pattern="[A-Za-z0-9]{5,6}"
                  oninvalid="this.setCustomValidity('This must be in postcode format e.g. IG48HG')"
                  onchange="try{setCustomValidity('')}catch(e){}"
                  oninput="setCustomValidity(' ')"
                  required
                />
              </div>
              <div class="new-card-modal__body__content__form__item">
                <label>Country</label>
                <input
                  type="text"
                  placeholder="Enter country"
                  v-model="cardDetails.country"
                  pattern="([a-zA-Z]|\s|\.)+"
                  oninvalid="this.setCustomValidity('This must only contain letters or spaces')"
                  onchange="try{setCustomValidity('')}catch(e){}"
                  oninput="setCustomValidity(' ')"
                  required
                />
              </div>
              <input type="submit" value="Confirm" />
            </div>
          </div>
        </form>
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
