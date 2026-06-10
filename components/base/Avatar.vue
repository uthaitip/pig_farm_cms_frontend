<template>
  <div>
    <div class="flex items-center gap-10">
      <div class="rounded-full border-solid bg-appdisabled flex items-center justify-center p-1" :class="[size]">
        <UIBaseHeroIcon v-if="!srcFile" name="user" :class-list="`${size} text-appgray`" />
        <img v-if="!!srcFile" :id="`img_${componentKey}`" :src="srcFile"
          class="object-cover rounded-full w-full h-full" />
      </div>
      <template v-if="!preview">
        <button type="button"
          class="flex gap-2 items-center text-[#1482C1] bg-white border border-[#1482C1] focus:outline-none hover:bg-gray-100 focus:ring-1 focus:ring-[#1482C1] font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
          @click="onClick">
          <UIBaseHeroIcon name="arrow-up-tray" class-list="h-4 w-4 text-white-500" />
          {{ label }}
          <span class="text-apperror font-black" v-if="isRequired">
            *
          </span>
        </button>
        <input :id="componentKey" type="file" class="hidden" @change="onChange" accept=".jpg, .jpeg, .png" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    componentKey: { type: String, default: () => "avatarUpload" },
    label: { type: String, default: () => "อัพโหลด" },
    src: { type: String, default: () => "" },
    file: { type: Object },
    preview: { type: Boolean, default: () => false },
    isRequired: { type: Boolean, default: () => false },
    size: { type: String, default: () => "w-[120px] h-[120px]" },
  },
  setup() { },
  mounted() {
    this.srcFile = this.src;
  },
  data() {
    return {
      srcFile: "",
    };
  },
  methods: {
    onChange($event: any) {
      if (!!$event.target?.files?.length) {
        const file = $event.target.files[0];
        this.readFile(file);

        this.$emit("onChange", {
          file: file,
        });
      }
    },
    readFile(file: File) {
      const reader = new FileReader();
      reader.addEventListener("load", (event: any) => {
        this.srcFile = event.target.result;
      });
      reader.readAsDataURL(file);
    },
    onClick() {
      const ele = document.getElementById(this.componentKey);
      ele?.click();
    },
  },
  watch: {
    file: function (n: any) {
      if (!!n && typeof n == "object") {
        if (n instanceof File) {
          this.readFile(n);
        } else if (!!n.path) {
          this.srcFile = n.path;
        } else {
          this.srcFile = "";
          const ele = document.getElementById(this.componentKey) as HTMLInputElement;
          ele.value = "";
        }
      }
    }
  }
};
</script>