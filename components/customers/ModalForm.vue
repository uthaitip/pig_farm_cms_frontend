<template>
  <UIBaseModal id="modal-customer-form" :title="editId ? 'แก้ไขลูกค้า' : 'เพิ่มลูกค้า'" width="max-w-xl"
    :show-footer="false" @on-created="(m: any) => (modal = m)">
    <div>
      <UIBaseGenerateFormGrid :fields="fields" />
      <div class="pt-2">
        <UIMasterAddressSelection :active="isOpen" :value="addressValue" @onChange="onAddressChange">
          <template #before-search>
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900">ถนน</label>
              <input
                type="text"
                v-model="(values as any).road"
                placeholder="ถนน"
                class="bg-white border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
          </template>
        </UIMasterAddressSelection>
      </div>
      <div class="pt-4">
        <label class="block mb-2 text-sm font-medium text-gray-900">หมายเหตุ</label>
        <textarea
          v-model="(values as any).note"
          placeholder="หมายเหตุ (ถ้ามี)"
          rows="3"
          class="bg-white border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>
      <div v-if="editId" class="pt-4">
        <label class="block mb-2 text-sm font-medium text-gray-900">สถานะ</label>
        <select
          v-model="(values as any).status"
          class="bg-white border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="ACTIVE">ใช้งาน</option>
          <option value="INACTIVE">ปิดใช้งาน</option>
        </select>
      </div>
      <p v-if="formError" class="text-sm text-apperror mt-1">{{ formError }}</p>
      <div class="flex justify-end gap-2 pt-3">
        <button type="button" class="px-4 py-2 text-sm border border-appborder rounded-lg hover:bg-gray-50"
          @click="modal?.hide()">ยกเลิก</button>
        <button type="button" class="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
          @click="onSubmit">บันทึก</button>
      </div>
    </div>
  </UIBaseModal>
</template>

<script lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

const EMPTY_FORM = { customerName: '', phoneNumber: '', houseNo: '', soi: '', road: '', note: '', status: 'ACTIVE' }

const validationSchema = toTypedSchema(zod.object({
  customerName: zod.string({ required_error: 'กรุณาระบุชื่อลูกค้า' }).min(1, 'กรุณาระบุชื่อลูกค้า'),
  phoneNumber:  zod.string({ required_error: 'กรุณาระบุเบอร์โทร' }).min(1, 'กรุณาระบุเบอร์โทร'),
  houseNo:      zod.string({ required_error: 'กรุณาระบุบ้านเลขที่' }).min(1, 'กรุณาระบุบ้านเลขที่'),
  soi:          zod.string().optional(),
  road:         zod.string().optional(),
  note:         zod.string().optional(),
  status:       zod.string().optional(),
}))

export default {
  emits: ['onSubmit'],

  setup() {
    const { validate, resetForm, setValues, values } = useForm({ validationSchema, initialValues: { ...EMPTY_FORM } })
    return { validate, resetForm, setValues, values }
  },

  data() {
    return {
      modal:        null as any,
      editId:       '' as string,
      formError:    '' as string,
      isOpen:       false as boolean,
      addressValue: null as any,
      addressData:  {} as any,
    }
  },

  computed: {
    fields(): any[] {
      return [
        {
          key: 'customerName', label: 'ชื่อลูกค้า', type: 'text', flex: 'half', required: true, useForm: true,
          value: (this.values as any).customerName,
          placeholder: 'ชื่อลูกค้า / ชื่อบริษัท',
        },
        {
          key: 'phoneNumber', label: 'เบอร์โทร', type: 'text', flex: 'half', required: false, useForm: true,
          value: (this.values as any).phoneNumber,
          placeholder: '0xx-xxx-xxxx',
        },
        {
          key: 'houseNo', label: 'บ้านเลขที่', type: 'text', flex: 'half', useForm: true,
          value: (this.values as any).houseNo,
          placeholder: 'บ้านเลขที่',
        },
        {
          key: 'soi', label: 'ซอย', type: 'text', flex: 'half', useForm: true,
          value: (this.values as any).soi,
          placeholder: 'ซอย',
        },
      ]
    },
  },

  methods: {
    show(item?: any) {
      this.editId    = item?._id ?? ''
      this.formError = ''
      this.addressValue = item
        ? { provinceId: item.provinceId, districtId: item.districtId, subDistrictId: item.subDistrictId }
        : null
      this.addressData = item
        ? {
            provinceId:      item.provinceId      ?? null,
            provinceName:    item.provinceName     ?? null,
            districtId:      item.districtId       ?? null,
            districtName:    item.districtName     ?? null,
            subDistrictId:   item.subDistrictId    ?? null,
            subDistrictName: item.subDistrictName  ?? null,
            zipCode:         item.zipCode          ?? null,
          }
        : {}
      const formValues = item
        ? {
            customerName: item.customerName ?? '',
            phoneNumber:  item.phoneNumber  ?? '',
            houseNo:      item.houseNo      ?? '',
            soi:          item.soi          ?? '',
            road:         item.road         ?? '',
            note:         item.note         ?? '',
            status:       item.status       ?? 'ACTIVE',
          }
        : { ...EMPTY_FORM }
      this.resetForm({ values: formValues })
      this.setValues(formValues)
      this.isOpen = true
      this.modal?.show()
    },

    hide() { this.isOpen = false; this.modal?.hide() },

    setError(msg: string) { this.formError = msg },

    onAddressChange(data: any) { this.addressData = data },

    async onSubmit() {
      const { valid } = await this.validate()
      if (!valid) return
      if (!this.addressData.provinceId)    { this.formError = 'กรุณาเลือกจังหวัด'; return }
      if (!this.addressData.districtId)    { this.formError = 'กรุณาเลือกอำเภอ'; return }
      if (!this.addressData.subDistrictId) { this.formError = 'กรุณาเลือกตำบล'; return }
      this.formError = ''
      const v = this.values as any
      this.$emit('onSubmit', {
        editId: this.editId,
        payload: {
          customerName: v.customerName.trim(),
          phoneNumber:  v.phoneNumber || null,
          houseNo:      v.houseNo     || null,
          soi:          v.soi         || null,
          road:         v.road        || null,
          address:      [v.houseNo, v.soi, v.road].filter(Boolean).join(' ') || null,
          note:         v.note        || null,
          provinceId:     this.addressData.provinceId    ?? null,
          provinceName:   this.addressData.provinceName  ?? null,
          districtId:     this.addressData.districtId    ?? null,
          districtName:   this.addressData.districtName  ?? null,
          subDistrictId:  this.addressData.subDistrictId ?? null,
          subDistrictName: this.addressData.subDistrictName ?? null,
          zipCode:        this.addressData.zipCode       ?? null,
          ...(this.editId ? { status: v.status } : {}),
        },
      })
    },
  },
}
</script>
