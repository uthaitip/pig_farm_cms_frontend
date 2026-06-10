<template>
  <div>
    <button :id="parseDefaultField.key" :data-dropdown-toggle="`dropdown_${parseDefaultField.key}`"
      class="flex items-center border border-primary font-medium rounded-lg text-sm px-2 py-2.5 text-center"
      :class="[isActive ? 'bg-primary text-white hover:bg-primary-800' : 'bg-white text-primary hover:bg-gray-200']"
      type="button" @click="onClickButton">
      <div v-if="$slots['prefixIcon']">
        <slot name="prefixIcon"></slot>
      </div>
      <UIBaseHeroIcon v-else class="grow" :name="parseDefaultField.prefixIcon ?? 'arrow-up-tray'" :color="isActive ? 'text-white' : 'text-primary'"
        size="h-5 w-5" />

      <span class="px-1">
        {{ parseDefaultField.label }}
      </span>
      <UIBaseHeroIcon class="grow" :name="parseDefaultField.suffixIcon ?? 'chevron-down'" :color="isActive ? 'text-white' : 'text-primary'"
        size="w-4 h-4" />
    </button>

    <!-- Dropdown menu -->
    <div :id="`dropdown_${parseDefaultField.key}`"
      class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow">
      <ul v-if="parseDefaultField.children && parseDefaultField.children.length > 0
      " class="py-2 text-sm text-gray-700 dark:text-gray-200" :aria-labelledby="parseDefaultField.key">
        <li v-for="child in parseDefaultField.children" :key="`option_${child.key}`">
          <div class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
            @click="() => onSelect(child)">
            {{ child.label }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Dropdown } from "flowbite";
import type { DropdownOptions } from "flowbite";

export default {
  props: {
    field: { type: Object, required: true },
    isActive: { type: Boolean, default: () => true },
    classButton: { type: String, default: "" },
    classOption: { type: String, default: "w-44" },
  },
  setup() { },
  components: {},
  mounted() {
    this.setDataOptions();
  },
  data() {
    return {
      options: {} as DropdownOptions,
      dropdown: {} as Dropdown,
    };
  },
  methods: {
    onSelect(e: any) {
      this.dropdown?.hide?.();
      this.$emit("onChange", { value: e });
    },
    onClickButton() {
      setTimeout(() => {
        this.dropdown?.show?.();
      }, 300);
    },

    setDataOptions() {
      this.options = {
        placement: "bottom",
        triggerType: "click",
        offsetSkidding: 0,
        offsetDistance: 10,
        delay: 300,
        ignoreClickOutsideClass: true,
        onHide: () => {
          // console.log("dropdown has been hidden");
        },
        onShow: () => {
          // console.log("dropdown has been shown");
        },
        onToggle: () => {
          // console.log("dropdown has been toggled");
        },
      };

      // set the element that trigger the dropdown menu on click
      const $triggerEl = document.getElementById(this.parseDefaultField.key!);
      // set the dropdown menu element
      const $targetEl = document.getElementById(
        `dropdown_${this.parseDefaultField.key!}`
      );

      this.dropdown = new Dropdown($targetEl, $triggerEl, this.options);
    },
  },
  computed: {
    parseDefaultField(): IInputFieldGrid {
      const inputFieldGrid = new InputFieldGrid({});
      const sInputField = new InputField({});
      return {
        ...inputFieldGrid,
        ...sInputField,
        ...this.field,
      };
    },
  },
  watch: {
  },
};
</script>
<style scoped></style>
