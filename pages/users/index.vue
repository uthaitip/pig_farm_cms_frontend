<template>
  <div>
    <div class="flex items-start justify-between pb-4 border-b-[3px] border-b-primary rounded-t">
      <h3 class="pt-2 text-xl font-semibold text-primary">ผู้ใช้งาน</h3>
      <button
        class="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        @click="onClickAdd"
      >
        + เพิ่มผู้ใช้
      </button>
    </div>

    <div class="pt-4">
      <UIBaseTable :options="tableOptions" :data-list="items" :show-running="true">
        <template #status="{ data }">
          <span
            class="px-2 py-0.5 rounded-full text-xs font-medium"
            :class="data.status === 'active' ? 'bg-green-100 text-appsuccess' : 'bg-gray-100 text-appgray'"
          >
            {{ data.status === 'active' ? 'ใช้งาน' : 'ระงับ' }}
          </span>
        </template>
        <template #action="{ data }">
          <div class="flex items-center justify-center gap-2">
            <button class="text-primary-500 hover:underline text-xs" @click="onClickEdit(data)">แก้ไข</button>
            <button class="text-apperror hover:underline text-xs" @click="onClickDelete(data._id)">ลบ</button>
          </div>
        </template>
      </UIBaseTable>
    </div>

    <UIBaseModal
      id="modal-user-form"
      :title="formMode === 'add' ? 'เพิ่มผู้ใช้งาน' : 'แก้ไขผู้ใช้งาน'"
      width="max-w-lg"
      :show-footer="false"
      @on-created="(m) => (modalForm = m)"
    >
      <VeeForm
        ref="refFormUser"
        :validation-schema="sValidationSchema"
        :initial-values="formValues"
        @submit="onSubmit"
      >
        <div class="space-y-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-appblack">ชื่อ-นามสกุล <span class="text-apperror">*</span></label>
            <VeeField name="fullName" v-slot="{ field, errors }">
              <input v-bind="field" type="text" placeholder="ชื่อ-นามสกุล"
                class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                :class="errors.length ? 'border-apperror' : 'border-appborder'" />
              <span v-if="errors.length" class="text-xs text-apperror">{{ errors[0] }}</span>
            </VeeField>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-appblack">อีเมล <span class="text-apperror">*</span></label>
            <VeeField name="email" v-slot="{ field, errors }">
              <input v-bind="field" type="email" placeholder="example@email.com"
                class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                :class="errors.length ? 'border-apperror' : 'border-appborder'" />
              <span v-if="errors.length" class="text-xs text-apperror">{{ errors[0] }}</span>
            </VeeField>
          </div>

          <div v-if="formMode === 'add'" class="flex flex-col gap-1">
            <label class="text-sm font-medium text-appblack">รหัสผ่าน <span class="text-apperror">*</span></label>
            <VeeField name="password" v-slot="{ field, errors }">
              <input v-bind="field" type="password" placeholder="อย่างน้อย 6 ตัวอักษร"
                class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                :class="errors.length ? 'border-apperror' : 'border-appborder'" />
              <span v-if="errors.length" class="text-xs text-apperror">{{ errors[0] }}</span>
            </VeeField>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-appblack">เบอร์โทร</label>
            <VeeField name="phone" v-slot="{ field }">
              <input v-bind="field" type="text" placeholder="0xx-xxx-xxxx"
                class="border border-appborder rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </VeeField>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-appblack">สิทธิ์การใช้งาน</label>
            <VeeField name="roleId" v-slot="{ field }">
              <select v-bind="field"
                class="border border-appborder rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                <option value="">-- ไม่ระบุ --</option>
                <option v-for="role in roles" :key="role._id" :value="role._id">{{ role.name }}</option>
              </select>
            </VeeField>
          </div>

          <div v-if="formMode === 'edit'" class="flex flex-col gap-1">
            <label class="text-sm font-medium text-appblack">สถานะ</label>
            <VeeField name="status" v-slot="{ field }">
              <select v-bind="field"
                class="border border-appborder rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                <option value="active">ใช้งาน</option>
                <option value="inactive">ระงับ</option>
              </select>
            </VeeField>
          </div>

          <p v-if="formError" class="text-sm text-apperror">{{ formError }}</p>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button"
              class="px-4 py-2 text-sm border border-appborder rounded-lg hover:bg-gray-50"
              @click="modalForm?.hide()">
              ยกเลิก
            </button>
            <button type="submit"
              class="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg">
              บันทึก
            </button>
          </div>
        </div>
      </VeeForm>
    </UIBaseModal>
  </div>
</template>

<script lang="ts">
import { Form as VeeForm, Field as VeeField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import type { Modal } from 'flowbite'

export default {
  components: { VeeForm, VeeField },

  setup() {
    definePageMeta({ layout: 'back-office' })
    const sLoadingState = useState<ILoading>('globalBaseLoading')
    const sAlertState   = useState<IModal>('globalAlertModal')
    return { sLoadingState, sAlertState }
  },

  data() {
    return {
      formMode:    'add' as 'add' | 'edit',
      formError:   '',
      formValues:  {} as any,
      currentUser: {} as any,
      modalForm:   null as Modal | null,
      items:       [] as any[],
      roles:       [] as any[],
      tableOptions: [
        { field: 'fullName', label: 'ชื่อ-นามสกุล', headerAlign: 'text-left',   dataAlign: 'text-left' },
        { field: 'email',    label: 'อีเมล',         headerAlign: 'text-left',   dataAlign: 'text-left' },
        { field: 'status',   label: 'สถานะ',         headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-28' },
        { field: 'action',   label: 'จัดการ',        headerAlign: 'text-center', dataAlign: 'text-center', width: 'w-24' },
      ] as any[],
    }
  },

  computed: {
    sValidationSchema() {
      const base = {
        fullName: zod.string({ required_error: 'กรุณากรอกชื่อ-นามสกุล' }).min(1, 'กรุณากรอกชื่อ-นามสกุล'),
        email:    zod.string({ required_error: 'กรุณากรอกอีเมล' }).email('รูปแบบอีเมลไม่ถูกต้อง'),
        phone:    zod.string().optional(),
        roleId:   zod.string().optional(),
        status:   zod.string().optional(),
      }
      const schema = this.formMode === 'add'
        ? { ...base, password: zod.string({ required_error: 'กรุณากรอกรหัสผ่าน' }).min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร') }
        : base
      return toTypedSchema(zod.object(schema))
    },
  },

  mounted() {
    this.reloadData()
    this.loadRoles()
  },

  methods: {
    async reloadData() {
      this.sLoadingState?.show()
      try {
        const response = await useFetchGetClient(apiSvcUsers, { params: { page: 1, limit: 999 } })
        const data = getSuccessDataClient(response)
        this.items = data?.list ?? data ?? []
      } finally {
        this.sLoadingState?.hide()
      }
    },

    async loadRoles() {
      const response = await useFetchGetClient(apiSvcRoles, { params: { page: 1, limit: 999 } }).catch(() => null)
      const data = getSuccessDataClient(response)
      this.roles = data?.list ?? data ?? []
    },

    onClickAdd() {
      this.formMode    = 'add'
      this.formError   = ''
      this.currentUser = {}
      this.formValues  = { fullName: '', email: '', password: '', phone: '', roleId: '', status: 'active' }
      ;(this.$refs.refFormUser as any)?.resetForm?.({ values: this.formValues })
      this.modalForm?.show()
    },

    onClickEdit(row: any) {
      this.formMode    = 'edit'
      this.formError   = ''
      this.currentUser = { ...row }
      this.formValues  = {
        fullName: row.fullName ?? '',
        email:    row.email    ?? '',
        phone:    row.phone    ?? '',
        roleId:   row.roleId   ?? '',
        status:   row.status   ?? 'active',
      }
      setTimeout(() => (this.$refs.refFormUser as any)?.setValues?.(this.formValues), 50)
      this.modalForm?.show()
    },

    onClickDelete(id: string) {
      this.sAlertState?.show(defaultAlertConfirm('ยืนยันการลบผู้ใช้?', async () => {
        this.sLoadingState?.show()
        try {
          await useFetchDeleteClient(apiSvcUsersById(id))
          await this.reloadData()
        } finally {
          this.sLoadingState?.hide()
        }
      }))
    },

    async onSubmit(values: any) {
      this.formError = ''
      this.sLoadingState?.show()
      try {
        const response = this.formMode === 'add'
          ? await useFetchPostClient(apiSvcUsers, {
              fullName: values.fullName,
              email:    values.email,
              password: values.password,
              phone:    values.phone  || undefined,
              roleId:   values.roleId || undefined,
            })
          : await useFetchPutClient(apiSvcUsersById(this.currentUser._id), {
              fullName: values.fullName,
              email:    values.email,
              phone:    values.phone  || undefined,
              roleId:   values.roleId || undefined,
              status:   values.status,
            })
        if (!isSuccessClient(response)) { this.formError = getErrorMessageClient(response); return }
        this.modalForm?.hide()
        ;(this.$refs.refFormUser as any)?.resetForm?.()
        this.sAlertState?.show(defaultAlertSuccess(this.formMode === 'add' ? 'เพิ่มผู้ใช้สำเร็จ' : 'แก้ไขผู้ใช้สำเร็จ'))
        await this.reloadData()
      } catch (e: any) {
        this.formError = e?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่'
      } finally {
        this.sLoadingState?.hide()
      }
    },
  },
}
</script>
