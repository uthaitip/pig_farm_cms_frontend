<template>
  <div>
    <label :for="parseDefaultField.key" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      <div>
        {{ parseDefaultField.label }}
        <span class="text-apperror font-black" v-if="parseDefaultField.required">
          *
        </span>
      </div>
    </label>

    <div class="relative" :class="[
      parseDefaultField.width === 'half'
        ? 'w-[49%]'
        : parseDefaultField.width === 'full'
          ? 'w-full'
          : parseDefaultField.width,
    ]">
      <div v-if="parseDefaultField.prefixIcon"
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <UIBaseHeroIcon :name="parseDefaultField.prefixIcon" classList="h-6 w-6 text-black-500" />
      </div>
      <input :type="parseDefaultField.type ? parseDefaultField.type : 'text'" :id="parseDefaultField.key"
        :value="sInputField.value.value" :class="[
          !!classList.length
            ? classList
            : 'w-full bg-white border border-gray-300 text-appblack text-sm placeholder-appgray placeholder-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:bg-appdisabled',
          !!parseDefaultField.prefixIcon
            ? 'pl-10'
            : !!parseDefaultField.suffixIcon
              ? 'pr-10'
              : '',
        ]" :maxlength="parseDefaultField.maxLength" :placeholder="parseDefaultField.placeholder"
        :disabled="parseDefaultField.disabled" @input="onChange" @blur="onBlur" :readonly="parseDefaultField.readonly"
        :step="parseDefaultField.step" :min="parseDefaultField.min" :max="parseDefaultField.max"
        v-maska:[parseDefaultField?.maskOption] />
      <button v-if="parseDefaultField.suffixIcon" type="button"
        class="text-black absolute right-0 bottom-0.5 font-medium rounded-lg text-sm px-2 py-2" @click="onClickSuffix">
        <UIBaseHeroIcon :name="parseDefaultField.suffixIcon" classList="h-6 w-6 text-black-500" />
      </button>
    </div>

    <span class="inline text-sm text-apperror" v-show="sInputField.errorMessage && !sInputField.meta.valid">
      {{ sInputField.errorMessage?.value }}
    </span>
  </div>
</template>

<script lang="ts">
import { useField } from "vee-validate";

export default {
  props: {
    field: { type: Object, required: true },
    classList: { type: [Array<String>, String, Object], default: () => [] },
  },
  setup(props: any) {
    const rules = props?.field?.rules ?? (props?.field?.required ? 'required' : undefined)
    const sInputField = useField(props?.field?.key, rules, {
      initialValue: props?.field?.value,
    });
    // let sIMask;
    if (!!props?.field?.maskOption) {
      // sIMask = useIMask(props.field.maskOption);
      // console.log(props?.field?.key, " == ", sIMask.el)
    }


    return { sInputField };
  },
  mounted() {
    if (this.parseDefaultField.useForm) {
      watchEffect(() => {
        if (this.changeField.value !== this.sInputField.value.value) {
          if (this.sInputField.value.value === undefined) {
            this.changeField.value = "";
            this.sInputField.setValue("");
          } else if (!!this.sInputField.value?.value) {
            this.changeField.value = this.sInputField.value?.value;
            // this.sInputField.setValue(this.sInputField.value?.value);
          }
        }
      });
    }
  },
  data() {
    return {
      changeField: {} as any,
      // timeChangeDelay: undefined as Date | undefined,
    };
  },
  methods: {
    onBlur(e: any) {
      this.sInputField.handleBlur(e);

      if (!this.parseDefaultField?.formatOnBlur) {
        return;
      }

      let value = this.sInputField.value?.value;

      if (value === '' || value === null || value === undefined) {
        return;
      }

      const num = Number(String(value).replace(/,/g, ''));

      if (isNaN(num)) {
        return;
      }

      const formatted = num.toFixed(2);

      // ✅ จุดสำคัญที่สุดของทั้งเรื่อง
      this.sInputField.setValue(formatted);

      // (ถ้าต้องการให้ parent รู้ด้วย)
      this.$emit('blur', {
        field: this.parseDefaultField,
        value: formatted,
      });
    },
    onChange(e: any) {
      this.sInputField.handleChange(e);
      const value = e?.target?.value;
      this.changeField = {
        ...this.changeField,
        value: value
      };

      // setTimeout(() => {
      // this.timeChangeDelay = new Date();

      this.$emit("onChange", {
        field: this.parseDefaultField,
        value: value,
      });
      // }, 300);
    },

    onClickSuffix() {
      this.$emit("onClickSuffix", this.sInputField.value?.value);
    },
  },
  computed: {
    parseDefaultField(): IInputFieldGrid {
      const inputFieldGrid = new InputFieldGrid({});
      const inputField = new InputField({});
      return {
        ...inputFieldGrid,
        ...inputField,
        ...this.field,
        ...this.changeField,
      };
    },
  },
  watch: {
    field: async function (n: any, o: any) {
      if (n?.value != null && n?.value != undefined && !this.parseDefaultField.useForm) {
        let isChangeByField = this.changeField.value != n.value;
        // isChangeByField = isChangeByField || this.sInputField.value.value != n.value;

        // const diffTime = new Date().getTime() - (this.timeChangeDelay?.getTime() ?? 0);
        // const isOvertime = diffTime > 1000;
        // if (isOvertime) {
        if (isChangeByField) {
          this.sInputField.setValue(n.value);
          this.$emit("onChange", {
            field: this.parseDefaultField,
            value: n.value,
          });
        }
        // } else {
        //   setTimeout(() => {
        //     if (n.value != o.value) {
        //       this.sInputField.setValue(n.value);
        //       this.$emit("onChange", {
        //         field: this.parseDefaultField,
        //         value: n.value,
        //       });
        //     }
        //   }, 300);
        // }

        this.changeField = { ...n };

        // setTimeout(() => {
        //   if (isOvertime && !!this.timeChangeDelay) {
        //     this.timeChangeDelay = undefined;
        //   }
        // }, 1000);


      }
    },
  },
};
</script>

<style scoped></style>