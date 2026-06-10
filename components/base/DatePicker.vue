<template>
  <div>
    <label :for="parseDefaultField.key" v-if="!!parseDefaultField.label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ parseDefaultField.label }}
      <span class="text-apperror font-black" v-if="parseDefaultField.required">
        *
      </span>
    </label>

    <div class="relative" :class="[
      parseDefaultField.width === 'half'
        ? 'w-[49%]'
        : parseDefaultField.width === 'full'
          ? 'w-full'
          : parseDefaultField.width,
    ]">
      <VueDatePicker
        locale="th"
        :enable-time-picker="false"
        :auto-apply="true"
        :model-value="dateValue"
        :week-start="1"
        :day-names="['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']"
        @update:model-value="onSelectedDate"
        @cleared="onCleared"
        :format="myFormat"
        :disabled="parseDefaultField.disabled"
        :placeholder="parseDefaultField.placeholder"
        :min-date="currentMinDate"
        :max-date="currentMaxDate"
        :teleport="true">
        <template #month-year="dataProps">
          <div class="w-full flex items-center justify-center gap-2">

            <button type="button" class="inline-block rounded-full bg-transparent align-middle h-full"
              @click="dataProps.handleMonthYearChange(false)">
              <UIBaseHeroIcon name="chevron-left" color="text-gray-500" size="h-5 w-auto" />
            </button>
            <select
              class="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-appdisabled"
              :value="dataProps.month" @change="(e: any) => updateMonth(e, dataProps.updateMonthYear, dataProps.year)">
              <option v-for="m in dataProps.months" :key="m.value" :value="m.value">{{ m.text }}
              </option>
            </select>
            <select
              class="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-appdisabled"
              :value="dataProps.year" @change="(e: any) => updateYear(e, dataProps.updateMonthYear, dataProps.month)">
              <option v-for="y in dataProps.years" :key="y.value" :value="y.value">{{ Number(y.text) + 543 }}</option>
            </select>
            <button type="button" class="inline-block rounded-full bg-transparent align-middle h-full"
              @click="dataProps.handleMonthYearChange(true)">
              <UIBaseHeroIcon name="chevron-right" color="text-gray-500" size="h-5 w-auto" />
            </button>
          </div>
        </template>
      </VueDatePicker>

      <input type="text" :id="parseDefaultField.key" :value="sInputField?.value?.value" class="hidden" />
    </div>

    <span class="inline text-sm text-apperror" v-show="!!sInputField?.errorMessage?.value && !sInputField?.meta?.valid">
      {{ sInputField.errorMessage?.value ?? "" }}
    </span>
  </div>
</template>

<script lang="ts">
import { useField } from "vee-validate";
import Datepicker from "flowbite-datepicker/Datepicker";
import VueDatePicker from "@vuepic/vue-datepicker";
import { formatDateSave, parseStringToDate, formatDateDisplayTH } from "~/composables/useDate";

type UpdateMonthYear = (month: number, year: number) => void;

export default {
  props: {
    field: { type: Object, required: true },
    textColor: {
      type: String,
      default: "text-appblack",
    },
    borderColor: {
      type: String,
      default: "border-disabled",
    },
    minDate: { type: [Date, String] },
    maxDate: { type: [Date, String] }
  },
  setup(props: any) {
    const initDate = new Date(props.field.value);
    const initDateStr = Datepicker.formatDate(initDate, "yyyy-mm-dd");

    const sInputField = useField(props.field.key, undefined, {
      initialValue: initDateStr,
    });

    return { sInputField, initDate };
  },
  components: { VueDatePicker },
  computed: {
    parseDefaultField(): IInputFieldGrid {
      const inputFieldGrid = new InputFieldGrid({});
      const inputFieldDefault = new InputField({});
      return {
        ...inputFieldGrid,
        ...inputFieldDefault,
        ...this.field,
        ...this.changeField,
      };
    },
  },
  mounted() {
    this.dateValue = this.initDate;
    this.changeField.value = "";

    this.currentMinDate = (this.parseDefaultField?.min?.toString() ?? this.minDate) ?? "";
    this.currentMaxDate = (this.parseDefaultField?.max?.toString() ?? this.maxDate) ?? "";

    if (!!this.parseDefaultField.useForm) {
      watchEffect(() => {
        if (this.sInputField.value?.value !== undefined && this.dateValue !== this.sInputField.value.value) {
          this.dateValue = new Date(this.sInputField.value?.value);
        }
      });
    }
  },
  data() {
    return {
      dateValue: null as any,
      changeField: {} as any,
      currentMinDate: "" as Date | string,
      currentMaxDate: "" as Date | string,
    };
  },
  methods: {
    updateMonth(event: InputEvent, updateMonthYear: UpdateMonthYear, year: number) {
      updateMonthYear(+(event.target as HTMLSelectElement).value, year);
    },

    updateYear(event: InputEvent, updateMonthYear: UpdateMonthYear, month: number) {
      updateMonthYear(month, +(event.target as HTMLSelectElement).value);
    },
    myFormat(date: Date) {
      return formatDateDisplayTH(date);
    },
    onSelectedDate(modelData: Date) {
      const dateStr = Datepicker.formatDate(modelData, "yyyy-mm-dd");
      this.sInputField?.setValue(dateStr);
      this.sInputField?.setErrors([]);

      setTimeout(() => {
        this.dateValue = modelData;
        this.changeField.value = this.sInputField?.value?.value;
        this.$emit("onChange", { value: modelData });
      }, 300);
    },
    onCleared() {
      this.sInputField?.setValue("");
      this.$emit("onChange", { value: null });
    },
  },
  watch: {
    field: function (n: any) {
      if (!!n && !this.parseDefaultField.useForm) {
        let isChangeByField = formatDateSave(this.changeField.value) != formatDateSave(n.value);
        isChangeByField = isChangeByField || formatDateSave(this.sInputField?.value?.value) != formatDateSave(n.value);

        if (isChangeByField) {
          if (!!n.value) {
            const date = parseStringToDate(n.value);
            this.sInputField.setValue(n.value);
            this.dateValue = date;
            this.changeField.value = this.sInputField?.value?.value;
            this.$emit("onChange", { value: date });
          } else {
            this.sInputField.setValue(null);
            this.dateValue = null;
            this.changeField.value = null;
            this.$emit("onChange", { value: null });
          }
        }

        this.changeField = { ...n };
      }
    },
    minDate: function (n: any) {
      this.currentMinDate = n ?? "";
    },
    maxDate: function (n: any) {
      this.currentMaxDate = n ?? "";
    },
  },
};
</script>

<style>
.datepicker-cell.selected {
  background-color: #1482c1;
}

input.dp__disabled {
  background-color: #dddddd;
}

input.dp__input::placeholder {
  color: "#999999" !important;
  font-size: 0.875rem !important;
}
</style>