<template>
  <div class="grid grid-cols-2 gap-4">
    <!-- slot: field ก่อน ตำบล (เช่น ถนน) -->
    <slot name="before-search" />

    <!-- ตำบล (search primary) -->
    <div :class="$slots['before-search'] ? 'col-span-1' : 'col-span-2'" class="relative">
      <label class="block mb-2 text-sm font-medium text-gray-900">ตำบล <span class="text-apperror">*</span></label>
      <div class="relative">
        <input
          type="text"
          v-model="searchText"
          @input="onSearchInput"
          @focus="onFocus"
          @blur="onBlur"
          placeholder="พิมพ์ชื่อตำบล..."
          class="bg-white border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8"
          autocomplete="off"
        />
        <button v-if="searchText" type="button" @click="clear"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none">
          &times;
        </button>
        <ul v-if="showDropdown && searchResults.length"
          class="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto mt-1">
          <li v-for="item in searchResults" :key="item.subDistrictId"
            @mousedown.prevent="onSelectResult(item)"
            class="px-4 py-2 text-sm hover:bg-primary-50 cursor-pointer">
            <span class="font-medium">{{ item.subDistrictName }}</span>
            <span class="text-appgray"> › {{ item.districtName }} › {{ item.provinceName }}</span>
            <span class="text-appgray ml-1">({{ item.zipCode }})</span>
          </li>
        </ul>
        <p v-if="showDropdown && searchText.length >= 2 && !searchResults.length && !searching"
          class="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow text-sm text-appgray px-4 py-2 mt-1">
          ไม่พบข้อมูล
        </p>
      </div>
    </div>

    <!-- อำเภอ -->
    <div class="col-span-1">
      <label class="block mb-2 text-sm font-medium text-gray-900">อำเภอ <span class="text-apperror">*</span></label>
      <select
        class="bg-white border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-appdisabled"
        :value="selectedDistrictId"
        :disabled="!selectedProvinceId"
        @change="onDistrictChange"
      >
        <option value="">-- เลือกอำเภอ --</option>
        <option v-for="d in districts" :key="d.id" :value="d.id">{{ d.name_th }}</option>
      </select>
    </div>

    <!-- จังหวัด -->
    <div class="col-span-1">
      <label class="block mb-2 text-sm font-medium text-gray-900">จังหวัด <span class="text-apperror">*</span></label>
      <select
        class="bg-white border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-appdisabled"
        :value="selectedProvinceId"
        @change="onProvinceChange"
      >
        <option value="">-- เลือกจังหวัด --</option>
        <option v-for="p in provinces" :key="p.id" :value="p.id">{{ p.name_th }}</option>
      </select>
    </div>

    <!-- รหัสไปรษณีย์ -->
    <div class="col-span-2">
      <label class="block mb-2 text-sm font-medium text-gray-900">รหัสไปรษณีย์</label>
      <input
        type="text"
        :value="zipCode"
        readonly
        placeholder="-"
        class="bg-gray-50 border border-gray-200 text-sm rounded-lg block w-full p-2.5 text-gray-500 cursor-default"
      />
    </div>
  </div>
</template>

<script lang="ts">
interface ThaiProvince    { id: number; name_th: string; name_en: string; geography_id: number }
interface ThaiDistrict    { id: number; name_th: string; name_en: string; province_id: number }
interface ThaiSubDistrict { id: number; name_th: string; name_en: string; district_id: number; zip_code: string }
interface SearchResult    { subDistrictId: number; subDistrictName: string; zipCode: string; districtId: number; districtName: string; provinceId: number; provinceName: string }
interface AddressValue    { provinceId?: number; districtId?: number; subDistrictId?: number }

export default {
  props: {
    value:  { type: Object as () => AddressValue | null, default: null },
    active: { type: Boolean, default: false },
  },

  emits: ['onChange'],

  data() {
    return {
      provinces:             [] as ThaiProvince[],
      districts:             [] as ThaiDistrict[],
      selectedProvinceId:    null as number | null,
      selectedDistrictId:    null as number | null,
      selectedSubDistrictId: null as number | null,
      zipCode:               '' as string,
      searchText:            '' as string,
      searchResults:         [] as SearchResult[],
      showDropdown:          false as boolean,
      searching:             false as boolean,
      debounceTimer:         null as ReturnType<typeof setTimeout> | null,
      // stored names for emit
      selectedProvinceName:    null as string | null,
      selectedDistrictName:    null as string | null,
      selectedSubDistrictName: null as string | null,
    }
  },

  async mounted() {
    if (this.active) {
      await this.loadProvinces()
      if (this.value) await this.prefill(this.value)
    }
  },

  methods: {
    async loadProvinces() {
      const res = await useFetchGetClient(apiSvcThaiProvinces)
      this.provinces = (getSuccessDataClient(res) as ThaiProvince[]) ?? []
    },

    async loadDistricts(provinceId: number) {
      const res = await useFetchGetClient(apiSvcThaiDistricts, { params: { provinceId } })
      this.districts = (getSuccessDataClient(res) as ThaiDistrict[]) ?? []
    },

    async prefill(val: AddressValue) {
      if (val.provinceId) {
        this.selectedProvinceId = val.provinceId
        await this.loadDistricts(val.provinceId)
        const p = this.provinces.find(x => x.id === val.provinceId)
        this.selectedProvinceName = p?.name_th ?? null
      }
      if (val.districtId) {
        this.selectedDistrictId = val.districtId
        const d = this.districts.find(x => x.id === val.districtId)
        this.selectedDistrictName = d?.name_th ?? null
      }
      if (val.subDistrictId) {
        this.selectedSubDistrictId = val.subDistrictId
        // load sub-districts to get name + zip
        const res = await useFetchGetClient(apiSvcThaiSubDistricts, { params: { districtId: val.districtId } })
        const subs = (getSuccessDataClient(res) as ThaiSubDistrict[]) ?? []
        const s = subs.find(x => x.id === val.subDistrictId)
        if (s) {
          this.searchText            = s.name_th
          this.selectedSubDistrictName = s.name_th
          this.zipCode               = String(s.zip_code)
        }
      }
    },

    onFocus() {
      if (this.searchText.length >= 2) this.showDropdown = true
    },

    onSearchInput() {
      this.selectedSubDistrictId   = null
      this.selectedSubDistrictName = null
      this.zipCode                 = ''
      if (this.debounceTimer) clearTimeout(this.debounceTimer)
      if (this.searchText.length < 2) { this.searchResults = []; this.showDropdown = false; return }
      this.debounceTimer = setTimeout(() => this.doSearch(), 300)
    },

    async doSearch() {
      this.searching = true
      try {
        const res = await useFetchGetClient(`${apiSvcThaiProvinces}/search`, { params: { q: this.searchText } })
        this.searchResults = (getSuccessDataClient(res) as SearchResult[]) ?? []
        this.showDropdown = true
      } finally {
        this.searching = false
      }
    },

    async onSelectResult(item: SearchResult) {
      this.searchText              = item.subDistrictName
      this.showDropdown            = false
      this.selectedProvinceId      = item.provinceId
      this.selectedProvinceName    = item.provinceName
      this.selectedDistrictId      = item.districtId
      this.selectedDistrictName    = item.districtName
      this.selectedSubDistrictId   = item.subDistrictId
      this.selectedSubDistrictName = item.subDistrictName
      this.zipCode                 = String(item.zipCode)

      await this.loadDistricts(item.provinceId)

      this.$emit('onChange', {
        provinceId:      item.provinceId,
        provinceName:    item.provinceName,
        districtId:      item.districtId,
        districtName:    item.districtName,
        subDistrictId:   item.subDistrictId,
        subDistrictName: item.subDistrictName,
        zipCode:         String(item.zipCode),
      })
    },

    onBlur() {
      setTimeout(() => { this.showDropdown = false }, 150)
    },

    clear() {
      this.searchText              = ''
      this.searchResults           = []
      this.showDropdown            = false
      this.selectedProvinceId      = null
      this.selectedProvinceName    = null
      this.selectedDistrictId      = null
      this.selectedDistrictName    = null
      this.selectedSubDistrictId   = null
      this.selectedSubDistrictName = null
      this.zipCode                 = ''
      this.districts               = []
      this.$emit('onChange', {
        provinceId: null, provinceName: null,
        districtId: null, districtName: null,
        subDistrictId: null, subDistrictName: null,
        zipCode: null,
      })
    },

    async onProvinceChange(e: Event) {
      const id = Number((e.target as HTMLSelectElement).value) || null
      this.selectedProvinceId      = id
      this.selectedDistrictId      = null
      this.selectedSubDistrictId   = null
      this.selectedProvinceName    = this.provinces.find(p => p.id === id)?.name_th ?? null
      this.selectedDistrictName    = null
      this.selectedSubDistrictName = null
      this.districts               = []
      this.searchText              = ''
      this.zipCode                 = ''
      if (id) await this.loadDistricts(id)
      this.emitChange()
    },

    onDistrictChange(e: Event) {
      const id = Number((e.target as HTMLSelectElement).value) || null
      this.selectedDistrictId      = id
      this.selectedSubDistrictId   = null
      this.selectedDistrictName    = this.districts.find(d => d.id === id)?.name_th ?? null
      this.selectedSubDistrictName = null
      this.searchText              = ''
      this.zipCode                 = ''
      this.emitChange()
    },

    emitChange() {
      this.$emit('onChange', {
        provinceId:      this.selectedProvinceId,
        provinceName:    this.selectedProvinceName,
        districtId:      this.selectedDistrictId,
        districtName:    this.selectedDistrictName,
        subDistrictId:   this.selectedSubDistrictId,
        subDistrictName: this.selectedSubDistrictName,
        zipCode:         this.zipCode || null,
      })
    },
  },

  watch: {
    async active(val: boolean) {
      if (val && !this.provinces.length) {
        await this.loadProvinces()
        if (this.value) await this.prefill(this.value)
      }
    },
    value: {
      async handler(newVal: AddressValue | null) {
        if (!newVal) {
          this.selectedProvinceId      = null
          this.selectedDistrictId      = null
          this.selectedSubDistrictId   = null
          this.selectedProvinceName    = null
          this.selectedDistrictName    = null
          this.selectedSubDistrictName = null
          this.districts               = []
          this.searchText              = ''
          this.zipCode                 = ''
          return
        }
        if (
          newVal.provinceId    !== this.selectedProvinceId ||
          newVal.districtId    !== this.selectedDistrictId ||
          newVal.subDistrictId !== this.selectedSubDistrictId
        ) {
          await this.prefill(newVal)
        }
      },
      deep: true,
    },
  },
}
</script>
