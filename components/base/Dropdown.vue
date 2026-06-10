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
      <select :id="parseDefaultField.key"
        class="bg-white border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:bg-appdisabled"
        @change="onChange" @blur="sInputField.handleBlur" :disabled="parseDefaultField.disabled" :class="[textColor]">
        <option v-for="child in parseDefaultField.children" :key="`option_${child.key}`" :value="child.value"
          :selected="sInputField.value.value == child.value">
          {{ child.label }}
        </option>
      </select>
    </div>

    <span class="inline text-sm text-apperror" v-show="sInputField.errorMessage?.value && !sInputField.meta.valid">
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
    const rules = props?.field?.rules ?? (props?.field?.required ? 'required' : undefined)
    const sInputField = useField(props.field.key, rules, {
      initialValue: props.field.value,
    });
    return { sInputField };
  },
  mounted() {
    this.textColor = this.getColor;

    if (this.parseDefaultField.useForm) {
      watchEffect(() => {
        if (this.changeField.value !== this.sInputField.value.value) {
          if (this.sInputField.value.value === undefined) {
            this.changeField.value = "";
            this.sInputField.setValue("");
          } else if (!!this.sInputField.value?.value) {
            this.changeField.value = this.sInputField.value?.value;
            this.sInputField.setValue(this.sInputField.value?.value);
          }
        }
      });
    }
  },
  data() {
    return {
      textColor: "text-appblack",
      changeField: {} as any,
    };
  },
  methods: {
    onChange(e: any) {
      this.sInputField.handleChange(e);
      this.textColor = this.getColor;

      this.changeField = {
        ...this.changeField,
        value: this.sInputField.value.value
      };

      this.$emit("onChange", { value: this.sInputField.value.value });
    },
  },
  computed: {
    parseDefaultField(): IInputFieldGrid {
      const inputFieldGrid = new InputFieldGrid({});
      const sInputField = new InputField({});
      return {
        ...inputFieldGrid, ...sInputField, ...this.field,
        ...this.changeField,
      };
    },
    getColor() {
      const find = this.parseDefaultField?.children?.find(
        (e: any) => e.key == this.sInputField.value.value
      );
      return find?.textClass ?? "text-appblack";
    },
  },
  watch: {
    field: function (n: any, o: any) {
      if (!!n && !this.parseDefaultField.useForm) {
        
        const isSetByField = this.changeField.value != n.value;
        if (isSetByField) {
          this.sInputField.setValue(n.value);
        }
        this.changeField = { ...n };
      }
    },
  },
};
</script>