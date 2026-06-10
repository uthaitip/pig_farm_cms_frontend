<template>
  <div>
    <label :for="parseDefaultField.key" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
      <textarea :id="parseDefaultField.key" :value="sInputField.value.value" @input="onChange"
        @blur="sInputField.handleBlur" rows="4"
        class="block p-2.5 w-full text-sm text-appblack bg-white rounded-lg border border-gray-300 focus:ring-primary focus:border-primary disabled:bg-appdisabled"
        :placeholder="parseDefaultField.placeholder" :disabled="parseDefaultField.disabled"
        :readonly="parseDefaultField.readonly"></textarea>
    </div>

    <span class="inline text-sm text-apperror" v-show="sInputField.errorMessage && !sInputField.meta.valid">
      {{ sInputField.errorMessage }}
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
    const sInputField = useField(props.field.key, undefined, {
      initialValue: props.field.value,
    });
    return { sInputField };
  },
  mounted() { },
  data() {
    return {
      changeField: {} as any,
      timeChangeDelay: undefined as Date | undefined,
    };
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
  methods: {
    onChange(e: any) {
      this.sInputField.handleChange(e);

      this.changeField.value = this.sInputField?.value?.value;
      this.timeChangeDelay = new Date();

      this.$emit("onChange", {
        field: this.field,
        value: this.sInputField.value?.value,
      });
    },
  },
  watch: {
    field: function (n: any) {
      const hasFieldValue = !!n && "value" in n;
      if (hasFieldValue && !this.parseDefaultField.useForm) {
        let isChangeByField = this.changeField.value != n.value;
        isChangeByField = isChangeByField || this.sInputField.value.value != n.value;

        const diffTime = new Date().getTime() - (this.timeChangeDelay?.getTime() ?? 0);
        const isOvertime = diffTime > 1000;
        if (isChangeByField && isOvertime) {
          this.sInputField.setValue(n.value);
          this.$emit("onChange", {
            field: this.parseDefaultField,
            value: n.value,
          });
        }

        this.changeField = { ...n };

        setTimeout(() => {
          if (isOvertime && !!this.timeChangeDelay) {
            this.timeChangeDelay = undefined;
          }
        }, 1000);
      }

    },
  },
};
</script>