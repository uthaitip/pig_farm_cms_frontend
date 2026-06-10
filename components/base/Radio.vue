<template>
  <div>
    <label :for="parseDefaultField.key" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ parseDefaultField.label }}

      <span class="text-apperror font-black" v-if="parseDefaultField.required">
        *
      </span>
    </label>

    <div :class="parseDefaultField.classPosition
      ? parseDefaultField.classPosition
      : 'flex gap-8'
      ">
      <div v-for="option in parseDefaultField.children" :key="`field_${parseDefaultField.key}_option_${option.key}`"
        class="items-center mb-4">
        <input :checked="option.value == sInputField.value.value" :id="`${parseDefaultField.key}-${option.key}`"
          type="radio" :value="option.value" @input="onChange" @blur="sInputField.handleBlur"
          :name="parseDefaultField.key"
          class="w-4 h-4 text-primary bg-white border-appgray focus:ring-primary-200 dark:focus:ring-appgray dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:bg-appdisabled disabled:text-appblack"
          :disabled="parseDefaultField.disabled || option.disabled" />
        <label :for="option.key" class="ml-2 text-sm font-medium text-appblack dark:text-gray-300">
          {{ option.label }}
        </label>
      </div>
    </div>

    <span class="inline text-sm text-apperror" v-show="sInputField.errorMessage.value && !sInputField.meta.valid">
      {{ sInputField.errorMessage.value }}
    </span>
  </div>
</template>

<script lang="ts">
import { useField } from "vee-validate";

export default {
  props: {
    field: { type: Object, required: true },
  },
  setup(props: any) {
    const sInputField = useField(props.field.key, undefined, {
      initialValue: props.field.value,
    });
    return { sInputField };
  },
  mounted() {
    if (this.parseDefaultField.useForm) {
      watch(() => this.sInputField.value, (n: any) => {
        if (this.changeField.value !== n.value) {
          if (n.value === undefined) {
            this.changeField.value = "";
            this.sInputField.setValue("");
          } else if (!!n?.value) {
            this.changeField.value = n?.value;
            this.sInputField.setValue(n?.value);
          }
        }
      });
    }
  },
  data() {
    return {
      changeField: {} as any,
    };
  },
  methods: {
    onChange(e: any) {
      this.sInputField.handleChange(e);
      this.$emit("onChange", {
        value: e.target.value?.toString(),
        checked: e.currentTarget.checked,
      });
    },
  },
  computed: {
    parseDefaultField: function () {
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
    field: function (n: any) {
      if (!!n && !this.parseDefaultField.useForm) {

        let isChangeByField = this.changeField.value != n.value;
        isChangeByField = isChangeByField || this.sInputField.value.value != n.value;

        if (isChangeByField) {
          this.sInputField.setValue(n.value);
        }

        this.changeField = { ...n };
      }
    },
  },
};
</script>