<template>
  <ClientOnly>
    <div class="w-full h-full" :class="[getAlign]">
      <div class="flex" :class="[direction === 'column'
        ? 'flex-col items-center text-center'
        : 'flex-row items-center',
        getAlign]">

        <!-- label ด้านบน (column) -->
        <label
          v-if="direction === 'column' && !!parseDefaultField.label"
          :for="parseDefaultField.key"
          class="mb-2 text-sm font-medium"
          :class="parseDefaultField.disabled ? 'text-appgray' : 'text-appblack'"
        >
          {{ parseDefaultField.label }}
          <span v-if="parseDefaultField.required" class="text-apperror font-black">*</span>
        </label>

        <input :id="parseDefaultField.key" type="checkbox" :value="parseDefaultField.value" @input="onInput"
          @blur="sInputField.handleBlur"
          class="w-4 h-4 border bg-white border-appgray dark:focus:ring-appgray rounded focus:ring-3 focus:ring-primary-200 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 disabled:bg-gray-300"
          :class="[bg, direction === 'column' ? 'mt-[10px]' : '']" :required="parseDefaultField.required" :checked="parseDefaultField.value"
          :disabled="parseDefaultField.disabled" />
        
        <!-- label ด้านข้าง (row) -->
        <label
          v-if="direction !== 'column' && !!parseDefaultField.label"
          :for="parseDefaultField.key"
          class="ml-2 text-sm font-medium"
          :class="parseDefaultField.disabled ? 'text-appgray' : 'text-appblack'"
        >
          {{ parseDefaultField.label }}
          <span v-if="parseDefaultField.required" class="text-apperror font-black">*</span>
        </label>

        <div v-if="parseDefaultField.suffixIcon" class="px-2">
          <UIBaseHeroIcon :name="parseDefaultField.suffixIcon" size="h-5 w-5" color="text-primary"
            class="cursor-pointer" @click="onClickSuffix" />
        </div>
      </div>

      <span class="inline text-sm text-apperror" v-show="sInputField.errorMessage?.value && !sInputField.meta.valid">
        {{ sInputField.errorMessage?.value }}
      </span>
    </div>
  </ClientOnly>
</template>

<script lang="ts">
import { useField } from "vee-validate";

export default {
  props: {
    field: { type: Object, required: true },
    align: { type: String, default: "start" },
    bg: { type: String, default: "text-primary" },
    direction: { type: String, default: "row" },
  },
  setup(props: any) {
    const sInputField = useField(props.field.key, undefined, {
      initialValue: !!props.field.value,
    });

    return { sInputField };
  },
  data() {
    return {
      changeField: {} as any,
    };
  },
  mounted() {
    if (!!this.parseDefaultField.useForm) {
      watchEffect(() => {
        if (this.changeField.value !== this.sInputField.value.value) {
          if (this.sInputField.value.value === undefined) {
            this.changeField.value = false;
            this.sInputField.setValue(false);
          } else if (this.sInputField.value?.value == true || this.sInputField.value?.value == false) {
            this.changeField.value = this.sInputField.value?.value;
            this.sInputField.setValue(this.sInputField.value?.value);
          }
        }
      });
    }
  },
  computed: {
    getAlign() {
      return `justify-${this.align ?? "start"}`;
    },
    parseDefaultField(): IInputFieldGrid {
      const inputFieldGridDefault = new InputFieldGrid({});
      const inputFieldDefault = new InputField({});

      return {
        ...inputFieldGridDefault,
        ...inputFieldDefault,
        ...this.field,
        ...this.changeField,
      };
    },
  },
  methods: {
    onInput(e: any) {
      this.sInputField.handleChange(e);
      this.sInputField.setValue(e.currentTarget.checked);
      this.changeField.value = e.currentTarget.checked;
      this.$emit("onChange", {
        value: this.parseDefaultField.value,
        checked: e.currentTarget.checked,
      });
    },
    onClickSuffix() {
      this.$emit("onClickSuffix", this.sInputField.value?.value);
    },
  },
  watch: {
    field: function (n: any) {
      if (!this.field.useForm) {
        this.changeField = {
          ...n,
          value: n.value == true || n.value == false ? n.value : n.checked
        };
      }
    },
  },
};
</script>