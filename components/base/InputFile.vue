<template>
  <div>
    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ parseDefaultField.label }} 
      <span v-if="description" class="text-xs text-apperror mb-2">{{ description }}</span>
      <span class="text-apperror font-black" v-if="parseDefaultField.required">
        *
      </span>
    </label>

    <div class="flex gap-2 p-2 bg-white border border-gray-200 rounded-lg" :class="[
      parseDefaultField.width === 'half'
        ? 'w-[49%]'
        : parseDefaultField.width === 'full'
          ? 'w-full'
          : parseDefaultField.width,
    ]">
      <div v-if="!isPreview">
        <button type="button"
          class="flex items-center gap-x-2 text-white border border-[primary] bg-primary font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:border-primary dark:text-primary dark:hover:text-white dark:hover:bg-primary dark:focus:ring-primary disabled:bg-appdisabled disabled:text-appgray"
          :disabled="parseDefaultField.disabled" @click="onClick">
          <UIBaseHeroIcon name="arrow-up-tray" class-list="h-4 w-4 text-white-500" />
          อัพโหลด
        </button>
        <input :id="parseDefaultField.key" type="file" tabindex="-1" class="hidden" @change="onChange"
          :accept="parseDefaultField.acceptFile ?? ''">
      </div>
      <div v-if="parseDefaultField.canEditDescFile" class="flex grow gap-2">
        <input :id="`input_${parseDefaultField.key}`" type="text"
          class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          v-model="fileDesc" :placeholder="parseDefaultField.placeholder" @change="onChangeDesc" />

        <div v-if="selected" class="flex grow gap-2 items-center justify-end w-full">
          <button type="button" @click="openFile" v-if="dShowPreview">
            <UIBaseHeroIcon name="eye" class-list="h-5 w-5 text-primary" />
          </button>
          <button type="button" @click="removeFile" v-if="dShowDelete">
            <UIBaseHeroIcon name="trash" class-list="h-5 w-5 text-apperror" />
          </button>
        </div>
      </div>
      <div v-else class="grid grid-cols-6 grow px-3 py-2 bg-white border border-gray-200 rounded-lg w-full ">
        <div class="col-span-5 truncate">
          <span v-if="selected" class="text-sm w-full line-clamp-1">{{ cFileName }}</span>
          <span v-if="!selected" class="text-sm text-gray-400 truncate">
            {{ parseDefaultField.placeholder }}
          </span>
        </div>
        <div>
          <div v-if="selected" class="flex grow gap-2 items-center justify-end">
            <button v-if="dShowPreview" type="button" @click="openFile">
              <UIBaseHeroIcon name="eye" class-list="h-5 w-5 text-primary" />
            </button>
            <button v-if="dShowDelete" type="button" @click="removeFile">
              <UIBaseHeroIcon name="trash" class-list="h-5 w-5 text-apperror" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="previewImg" class="flex gap-2 p-2">
      <img v-if="previewImgSelected" :src="previewImgSelected" class="w-full h-[350px] object-contain" />
      <div v-else class="w-full h-[350px] object-contain flex justify-center items-center">กรุณาอัพโหลดรูปหน้าสมุดบัญชี
      </div>
    </div>


    <span class="inline text-sm text-apperror" v-show="sInputField.errorMessage && !sInputField.meta?.valid">
      {{ sInputField.errorMessage }}
    </span>

    <!-- <UIBaseModal :id="`ui_base_input_file_preview_${parseDefaultField.key}_${new Date().getTime()}`" title="แสดงไฟล์" :show-footer="false"
      :level-modal="2" @onCreated="(m) => modal = m">
      <div v-if="!!fileSrc && (selected.type.startsWith('image/') || selected?.meta?.contentType?.startsWith('image/'))"
        class="flex justify-center pb-4">
        <img :src="fileSrc" class="max-w-full max-h-[80vh] object-contain self-center" />
      </div>
      <embed
        v-if="!!fileSrc && !(selected.type.startsWith('image/') || selected?.meta?.contentType?.startsWith('image/'))"
        :src="fileSrc" class="w-full h-[800px]" />
    </UIBaseModal> -->
  </div>
</template>

<script lang="ts">
import { useField } from "vee-validate";
// import { Modal } from "flowbite";

export default {
  props: {
    field: { type: Object, required: true },
    classList: { type: [Array<String>, String, Object], default: () => [] },
    isPreview: { type: Boolean, default: () => false },
    showIconPreview: { type: Boolean, default: true },
    showIconDelete: { type: Boolean, default: true },
    previewImg: { type: Boolean, default: false },
    description: { type: String, default: '' }, // Description text below label (red color)
  },
  setup(props: any) {
    const sModalShowImageState = useState<ILoading>("globalBaseModalShowImage");
    const isAttachment = sIsValidUrl(props?.field?.value?.publicUrl);

    const sInputField = useField(props.field.key, undefined, {
      initialValue: isAttachment ? props.field.value : undefined,
    });

    function sIsValidUrl(urlString?: string) {
      try {
        if (!!urlString) {
          return Boolean(new URL(urlString));
        }
        return false;
      }
      catch (e) {
        return false;
      }
    }

    return { sInputField, sIsValidUrl, sModalShowImageState };
  },
  mounted() {

    this.isAttachment = this.sIsValidUrl(this.parseDefaultField?.value?.publicUrl);
    this.dShowDelete = !!this.parseDefaultField.disabled ? false : this.showIconDelete;
    this.dShowPreview = this.showIconPreview;

    if (this.parseDefaultField.value?._id == "-1") {
      this.selected = null
    } else {
      this.selected = this.parseDefaultField.value
    }

    if (this.parseDefaultField.useForm) {
      watchEffect(() => {
        if (this.changeField.value?.path !== this.sInputField.value.value?.path) {
          if (this.sInputField.value.value === undefined) {
            this.changeField.value = undefined;
            this.sInputField.setValue(undefined);
          } else if (!!this.sInputField.value?.value) {
            this.isAttachment = this.sIsValidUrl(this.sInputField.value.value?.publicUrl);

            if (this.isAttachment) {
              this.selected = this.sInputField.value?.value
              this.changeField.value = this.sInputField.value?.value;
              this.sInputField.setValue(this.sInputField.value?.value);
              if (this.previewImg) {
                this.previewImgSelected = this.selected.publicUrl
              }
            } else {
              this.changeField.value = undefined;
              this.sInputField.setValue(undefined);
            }
          }
        }
      });
    }


  },
  data() {
    return {
      dShowDelete: false,
      dShowPreview: false,
      isAttachment: false,
      changeField: {} as any,
      // modal: {} as Modal,
      selected: null as any, // File or Attachment
      fileDesc: "" as any,
      fileSrc: "" as any,
      previewImgSelected: "" as any,
    };
  },
  methods: {
    onChange($event: any) {
      if (!!$event.target?.files?.length) {
        this.selected = $event.target.files[0];
        this.isAttachment = false;

        if (!this.parseDefaultField.canEditDescFile || this.fileDesc === "") {
          this.fileDesc = this.selected?.name ?? "";
        }
        this.changeField = {
          ...this.changeField,
          value: this.selected,
        }
        this.$emit("onChange", {
          file: this.selected,
          description: this.fileDesc,
        });
        if (this.previewImg) {
          const reader = new FileReader();
          reader.addEventListener("load", (event: any) => {
            this.previewImgSelected = event.target.result;
          });
          reader.readAsDataURL(this.selected);
        }
      }
    },
    onChangeDesc($event: any) {
      this.fileDesc = $event.target.value;
      this.$emit("onChange", {
        file: this.selected,
        description: this.fileDesc,
      });
    },
    onClick() {
      const ele = document.getElementById(this.parseDefaultField.key ?? "");
      ele?.click();
    },
    removeFile() {
      const ele = document.getElementById(
        this.parseDefaultField.key ?? ""
      ) as HTMLInputElement;
      if (!!ele?.files?.length) {
        ele.value = "";
        ele.files = null;
      }
      this.selected = null;
      this.fileSrc = null;
      this.fileDesc = "";
      this.previewImgSelected = null;

      this.$emit("onChange", {
        file: this.selected,
        description: this.fileDesc,
      });
    },
    openFile() {
      if (this.isAttachment || this.selected.publicUrl) {
        // window.open(this.selected.publicUrl, '_blank');
        // location.assign(this.parseDefaultField?.value?.publicUrl)
        this.fileSrc = this.selected.publicUrl;
        // this.modal.show();

        this.sModalShowImageState?.show?.({
          title: "แสดงไฟล์",
          srcFile: this.fileSrc,
          attachment: this.selected
        });
      } else {
        this.readFile(this.selected);
      }
    },
    readFile(file?: File) {
      if (!!file) {
        const fileUrl = URL.createObjectURL(file);
        this.sModalShowImageState?.show?.({
          title: "แสดงไฟล์",
          srcFile: fileUrl,
          attachment: this.selected
        });
        // const reader = new FileReader();
        // reader.addEventListener("load", (event: any) => {
        //   this.fileSrc = event.target.result;

        //   // this.modal.show();
        //   this.sModalShowImageState?.show?.({
        //     title: "แสดงไฟล์",
        //     srcFile: this.fileSrc,
        //     attachment: this.selected
        //   });
        // });
        // // if(file?.publicUrl){
        // //   fetch(file?.publicUrl)
        // //     .then(response => response.blob())
        // //     .then(blob => reader.readAsDataURL(blob))
        // // }else{
        // reader.readAsDataURL(file);
        // // }
      }
    },
  },
  computed: {
    parseDefaultField(): IInputFieldGrid {
      const inputFieldGrid = new InputFieldGrid({});
      const inputField = new InputField({});
      return { ...inputFieldGrid, ...inputField, ...this.field };
    },
    cFileName() {
      const name = this.selected.originalname ?? (this.selected.name ?? this.selected.path);
      const nameSplit = name?.split("/")
      return nameSplit?.length ? nameSplit.slice(-1)[0] : name;
    }
  },
  watch: {
    field: function (n: any) {
      this.isAttachment = this.sIsValidUrl(n.value?.publicUrl)
      const hasFieldValue = !!n && typeof n == 'object' && !!Object.keys(n).find((k) => k === "value");
      if (hasFieldValue && !this.parseDefaultField.useForm) {
        let isChangeByField = this.changeField.value?._id != n.value?._id || this.changeField.value?.name != n.value?.name;

        if (isChangeByField) {
          if (n.value?._id?.toString() == "-1") {
            this.previewImgSelected = "";
            this.selected = null;
            const ele = document.getElementById(this.parseDefaultField.key ?? "") as HTMLInputElement;
            if (ele) ele.value = "";
          } else if (n.value?.path && n.value?.publicUrl) {

            this.previewImgSelected = n.value?.publicUrl ?? "";

            this.selected = {
              originalname: n.value?.name ?? n.value?.originalname ?? "",
              name: n.value?.path ?? "",
              type: n.value?.meta?.contentType ?? "",
              publicUrl: n.value?.publicUrl ?? "",
            }
          } else {
            // this.previewImgSelected = n.value?.publicUrl ?? "";
            this.selected = n.value ?? {};
          }
        }
        this.changeField = { ...n };
      }
    },
    showIconDelete: function (n: any) {
      this.dShowDelete = !!n;
    },
    showIconPreview: function (n: any) {
      this.dShowPreview = !!n;
    },
  },
}
</script>
