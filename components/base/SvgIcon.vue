<template>
  <div class="w-full h-full">
    <IconFarmer v-if="name === 'farmer'" class="!w-full !h-full" />
    <IconBuysell v-if="name === 'buysell'" class="!w-full !h-full" />
    <IconCollateral v-if="name === 'collateral'" class="!w-full !h-full" />
    <IconGuarantor v-if="name === 'guarantor'" class="!w-full !h-full" />
    <IconQuotaDealer v-if="name === 'quota-dealer'" class="!w-full !h-full" />
    <IconSugar v-if="name === 'sugar'" class="!w-full !h-full" />
    <IconBookBank v-if="name === 'book-bank'" class="!w-full !h-full" />
    <IconBusiness v-if="name === 'business'" class="!w-full !h-full" />
    <IconCar v-if="name === 'car'" class="!w-full !h-full" />
    <IconCreditCard v-if="name === 'credit-card'" class="!w-full !h-full" />
    <IconDevice v-if="name === 'device'" class="!w-full !h-full" />
    <IconMate v-if="name === 'mate'" class="!w-full !h-full" />
    <IconClock v-if="name === 'IconClock'" class="!w-full !h-full"/>
    <IconUsingCredit v-if="name === 'IconUsingCredit'" class="!w-full !h-full"/>
    <IconSmartPhone v-if="name === 'IconSmartPhone'" class="!w-full !h-full"/>
    <IconMoney v-if="name === 'IconMoney'" class="!w-full !h-full"/>
  </div>
</template>

<script lang="ts">
import IconFarmer from "~/assets/icons/ic-farmer.svg";
import IconBuysell from "~/assets/icons/ic-buysell.svg";
import IconCollateral from "~/assets/icons/ic-collateral.svg";
import IconGuarantor from "~/assets/icons/ic-guarantor.svg";
import IconQuotaDealer from "~/assets/icons/ic-quota-dealer.svg";
import IconSugar from "~/assets/icons/ic-sugar.svg";
import IconBookBank from "~/assets/icons/ic-book-bank.svg";
import IconBusiness from "~/assets/icons/ic-business.svg";
import IconCar from "~/assets/icons/ic-car.svg";
import IconCreditCard from "~/assets/icons/ic-credit-card.svg";
import IconDevice from "~/assets/icons/ic-device.svg";
import IconMate from "~/assets/icons/ic-mate.svg";
import IconClock from "~/assets/icons/clock.svg";
import IconUsingCredit from "~/assets/icons/using-cradit.svg";
import IconSmartPhone from "~/assets/icons/smartphone.svg";
import IconMoney from "~/assets/icons/money.svg";


export default {
  components: {
    IconFarmer,
    IconBuysell,
    IconCollateral,
    IconGuarantor,
    IconQuotaDealer,
    IconSugar,
    IconBookBank,
    IconBusiness,
    IconCar,
    IconCreditCard,
    IconDevice,
    IconMate,
    IconClock,
    IconUsingCredit,
    IconSmartPhone,
    IconMoney,
  },
  props: {
    name: { type: String, default: "" },
  },
};
</script>