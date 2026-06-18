<template>
  <div>
    <div class="flex items-start justify-between pb-4 border-b-[3px] border-b-primary rounded-t mb-6">
      <h3 class="pt-2 text-xl font-semibold text-primary">โปรไฟล์ของฉัน</h3>
    </div>

    <div class="flex items-center gap-4 mb-6">
      <div class="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold select-none">
        {{ initials }}
      </div>
      <div>
        <p class="text-lg font-bold text-appblack">{{ profile?.fullName || '-' }}</p>
        <p class="text-sm text-appgray">{{ profile?.email }}</p>
        <span class="mt-1 inline-block px-2 py-0.5 bg-primary-50 text-primary-600 text-xs rounded-full font-medium">
          {{ profile?.roleId?.name ?? profile?.role?.name ?? '-' }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white border border-appborder rounded-xl p-5">
        <h4 class="text-sm font-semibold text-appblack mb-4">ข้อมูลส่วนตัว</h4>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-appgray mb-1 block">ชื่อ <span class="text-apperror">*</span></label>
            <input v-model="profileForm.firstName" type="text" placeholder="ชื่อ"
              class="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label class="text-xs text-appgray mb-1 block">นามสกุล <span class="text-apperror">*</span></label>
            <input v-model="profileForm.lastName" type="text" placeholder="นามสกุล"
              class="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div class="col-span-2">
            <label class="text-xs text-appgray mb-1 block">อีเมล</label>
            <input v-model="profileForm.email" type="email" placeholder="อีเมล"
              class="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div class="col-span-2">
            <label class="text-xs text-appgray mb-1 block">เบอร์โทร</label>
            <input v-model="profileForm.phone" type="text" placeholder="เบอร์โทร"
              class="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
        </div>
        <p v-if="profileError" class="text-sm text-apperror mt-3">{{ profileError }}</p>
        <div class="flex justify-end mt-4">
          <button type="button"
            class="px-5 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium"
            @click="saveProfile">
            บันทึกข้อมูล
          </button>
        </div>
      </div>

      <div class="bg-white border border-appborder rounded-xl p-5">
        <h4 class="text-sm font-semibold text-appblack mb-4">เปลี่ยนรหัสผ่าน</h4>
        <div class="space-y-3">
          <div>
            <label class="text-xs text-appgray mb-1 block">รหัสผ่านปัจจุบัน <span class="text-apperror">*</span></label>
            <input v-model="pwForm.oldPassword" type="password" placeholder="รหัสผ่านปัจจุบัน"
              class="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label class="text-xs text-appgray mb-1 block">รหัสผ่านใหม่ <span class="text-apperror">*</span></label>
            <input v-model="pwForm.password" type="password" placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
              class="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label class="text-xs text-appgray mb-1 block">ยืนยันรหัสผ่านใหม่ <span class="text-apperror">*</span></label>
            <input v-model="pwForm.confirmPassword" type="password" placeholder="ยืนยันรหัสผ่านใหม่"
              class="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
        </div>
        <p v-if="pwError" class="text-sm text-apperror mt-3">{{ pwError }}</p>
        <div class="flex justify-end mt-4">
          <button type="button"
            class="px-5 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium"
            @click="changePassword">
            เปลี่ยนรหัสผ่าน
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  setup() {
    definePageMeta({ layout: 'back-office' })
    const sLoadingState = useState<ILoading>('globalBaseLoading')
    const sAlertState   = useState<IModal>('globalAlertModal')
    const profile       = useProfile()
    return { sLoadingState, sAlertState, profile }
  },

  data() {
    return {
      profileForm: { firstName: '', lastName: '', email: '', phone: '' },
      profileError: '' as string,
      pwForm: { oldPassword: '', password: '', confirmPassword: '' },
      pwError: '' as string,
    }
  },

  computed: {
    initials() {
      const name = this.profile?.fullName || this.profile?.firstName || '?'
      return name.charAt(0).toUpperCase()
    },
  },

  mounted() {
    if (this.profile) {
      this.profileForm = {
        firstName: this.profile.firstName ?? '',
        lastName:  this.profile.lastName  ?? '',
        email:     this.profile.email     ?? '',
        phone:     this.profile.phone     ?? '',
      }
    }
  },

  methods: {
    async saveProfile() {
      this.profileError = ''
      if (!this.profileForm.firstName.trim()) { this.profileError = 'กรุณาระบุชื่อ'; return }
      if (!this.profileForm.lastName.trim())  { this.profileError = 'กรุณาระบุนามสกุล'; return }

      this.sLoadingState?.show()
      try {
        const response = await useFetchPutClient(apiSvcUsersById(this.profile._id), {
          firstName: this.profileForm.firstName.trim(),
          lastName:  this.profileForm.lastName.trim(),
          email:     this.profileForm.email.trim()  || undefined,
          phone:     this.profileForm.phone.trim()  || undefined,
        })
        if (!isSuccessClient(response)) { this.profileError = getErrorMessageClient(response); return }

        const meResponse = await useFetchGetClient(apiSvcMe)
        const newProfile = getSuccessDataClient(meResponse)
        if (newProfile) useProfile().value = newProfile

        this.sAlertState?.show(defaultAlertSuccess('บันทึกข้อมูลสำเร็จ'))
      } catch (e: any) {
        this.profileError = e?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่'
      } finally {
        this.sLoadingState?.hide()
      }
    },

    async changePassword() {
      this.pwError = ''
      if (!this.pwForm.oldPassword)            { this.pwError = 'กรุณาระบุรหัสผ่านปัจจุบัน'; return }
      if (!this.pwForm.password)               { this.pwError = 'กรุณาระบุรหัสผ่านใหม่'; return }
      if (this.pwForm.password.length < 6)     { this.pwError = 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร'; return }
      if (this.pwForm.password !== this.pwForm.confirmPassword) { this.pwError = 'รหัสผ่านใหม่ไม่ตรงกัน'; return }

      this.sLoadingState?.show()
      try {
        const response = await useFetchPatchClient(apiSvcUsersPasswordById(this.profile._id), {
          oldPassword: this.pwForm.oldPassword,
          password:    this.pwForm.password,
        })
        if (!isSuccessClient(response)) { this.pwError = getErrorMessageClient(response); return }
        this.pwForm = { oldPassword: '', password: '', confirmPassword: '' }
        this.sAlertState?.show(defaultAlertSuccess('เปลี่ยนรหัสผ่านสำเร็จ'))
      } catch (e: any) {
        this.pwError = e?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่'
      } finally {
        this.sLoadingState?.hide()
      }
    },
  },
}
</script>
