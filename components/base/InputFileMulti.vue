<template>
  <div>
    <label v-if="label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ label }}
      <span v-if="description" class="text-xs text-apperror mb-2">{{ description }}</span>
      <span v-if="required" class="text-apperror font-black">*</span>
    </label>

    <input
      ref="inputRef"
      type="file"
      multiple
      tabindex="-1"
      class="hidden"
      :accept="accept"
      @change="onFileInputChange"
    />

    <button
      type="button"
      class="flex items-center gap-x-2 text-white border border-primary font-medium rounded-lg text-sm px-4 py-2.5 text-center disabled:bg-appdisabled disabled:text-appgray"
      :class="buttonColorClass"
      @click="openFilePicker"
      :disabled="disabled"
    >
      <UIBaseHeroIcon name="arrow-up-tray" class-list="h-4 w-4 text-white" />
      {{ buttonText }}
    </button>

    <div v-if="selectedFiles.length > 0" class="mt-3 flex flex-col gap-2">
      <div
        v-for="(file, index) in selectedFiles"
        :key="index"
        class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm font-medium text-appblack truncate max-w-[200px]">
              {{ getFileName(file) }}
            </span>
            <span
              class="text-xs px-2 py-0.5 rounded-full font-medium"
              :class="isNewFile(file) ? 'bg-appsuccess/10 text-appsuccess' : 'bg-primary/10 text-primary'"
            >
              {{ isNewFile(file) ? 'อัพโหลดใหม่' : 'อัพโหลดแล้ว' }}
            </span>
          </div>
          <div class="flex items-center gap-3 mt-1 text-xs text-appgray">
            <span>{{ formatFileSize(file) }}</span>
            <span>{{ getFileType(file) }}</span>
          </div>
        </div>

        <button
          type="button"
          class="shrink-0 p-1 rounded hover:bg-gray-100"
          @click="removeFile(index)"
        >
          <UIBaseHeroIcon name="trash" class-list="h-4 w-4 text-apperror" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    label: { type: String, default: '' },
    description: { type: String, default: '' },
    required: { type: Boolean, default: false },
    buttonText: { type: String, default: 'อัพโหลดไฟล์' },
    buttonColor: { type: String, default: 'primary' },
    selectedFiles: { type: Array as () => any[], default: () => [] },
    accept: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  emits: ['onChange'],
  data() {
    return {
      deletedFiles: [] as any[],
    };
  },
  computed: {
    buttonColorClass(): string {
      const colorMap: Record<string, string> = {
        primary: 'bg-primary hover:bg-primary-600',
        success: 'bg-appsuccess hover:bg-appsuccess/90',
        error: 'bg-apperror hover:bg-apperror/90',
        pending: 'bg-apppending hover:bg-apppending/90',
      };
      return colorMap[this.buttonColor] ?? `bg-${this.buttonColor}`;
    },
  },
  methods: {
    openFilePicker() {
      (this.$refs.inputRef as HTMLInputElement)?.click();
    },
    emitChange(files: any[]) {
      const newFiles = files.filter((f) => f instanceof File);
      this.$emit('onChange', {
        files,
        newFiles,
        deletedFiles: this.deletedFiles,
      });
    },
    onFileInputChange(event: Event) {
      const input = event.target as HTMLInputElement;
      if (!input.files?.length) return;

      const added = Array.from(input.files);
      const updated = [...this.selectedFiles, ...added];
      this.emitChange(updated);

      // Reset input so same file can be re-selected
      input.value = '';
    },
    removeFile(index: number) {
      const removed = this.selectedFiles[index];

      // Track only server files (non-File instance) as deleted
      if (!(removed instanceof File)) {
        this.deletedFiles = [...this.deletedFiles, removed];
      }

      const updated = this.selectedFiles.filter((_, i) => i !== index);
      this.emitChange(updated);
    },
    isNewFile(file: any): boolean {
      return file instanceof File;
    },
    getFileName(file: any): string {
      if (file instanceof File) return file.name;
      return file.originalname ?? file.name ?? file.path ?? '';
    },
    formatFileSize(file: any): string {
      const size: number = file instanceof File ? file.size : (file.size ?? 0);
      if (!size) return '-';
      if (size < 1024) return `${size} B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    },
    getFileType(file: any): string {
      if (file instanceof File) return file.type || '-';
      return file.meta?.contentType ?? file.type ?? '-';
    },
  },
};
</script>
