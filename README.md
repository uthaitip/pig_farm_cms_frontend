# Pig Farm CMS — Frontend

Nuxt 3 + TypeScript + Tailwind CSS  
ระบบจัดการฟาร์มหมู ฝั่ง Frontend (SPA)

---

## Architecture

```
pig_farm_cms_frontend  →  pig-farm-service (port 8082)
     (Nuxt 3 SPA)           (NestJS + MongoDB)
```

ทุก API call ไปที่ `pig-farm-service` โดยตรง ผ่าน composable `use-cms-fetch.ts`  
(`useFetchGetClient`, `useFetchPostClient`, `useFetchPutClient`, `useFetchPatchClient`, `useFetchDeleteClient`)

---

## เริ่มต้นใช้งาน

### สิ่งที่ต้องมีก่อน

- Node.js >= 18
- pig-farm-service รันอยู่ที่ port 8082

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า environment

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์

```env
API_CMS=http://localhost:8082/api
APP_VERSION=1.0
```

### 3. รัน development server

```bash
npm run dev
# เปิดที่ http://localhost:3000
```

### 4. Build สำหรับ production (SPA)

```bash
npm run build
npm run preview   # ทดสอบ build
```

หรือ serve ด้วย static file server (Nginx, Caddy ฯลฯ) จาก `.output/public/`

---

## โครงสร้างโปรเจกต์

```
pig_farm_cms_frontend/
├── nuxt.config.ts             # SSR=false (SPA), runtimeConfig, vee-validate presets
├── assets/css/input.css       # Tailwind CSS entry
│
├── composables/
│   ├── api-service.ts         # endpoint constants ทั้งหมด (apiSvc*)
│   ├── api.ts                 # legacy endpoint constants
│   ├── use-cms-fetch.ts       # useFetchGetClient, useFetchPostClient, ...
│   ├── use-bff-fetch.ts       # (ไม่ได้ใช้งานหลัก)
│   ├── useProfile.ts          # useState('profile') — ข้อมูล user ที่ login อยู่
│   ├── useLoading.ts          # useState('globalBaseLoading')
│   ├── useDate.ts             # helper format วันที่
│   ├── constants/             # number format, app constants
│   ├── interfaces/            # TypeScript interfaces
│   └── models/                # TypeScript types
│
├── pages/
│   ├── login.vue              # หน้า login
│   ├── dashboard/             # ภาพรวมฟาร์ม
│   ├── pig-batches/           # ล็อตหมู + transactions
│   ├── pigs/                  # ข้อมูลหมูรายตัว
│   ├── pens/                  # คอก
│   ├── feed-stocks/           # สต็อกอาหาร + transactions
│   ├── feed-types/            # ประเภทอาหาร
│   ├── sales/                 # รายการขาย
│   ├── customers/             # ลูกค้า
│   ├── report/                # รายงาน
│   ├── profile.vue            # โปรไฟล์ + เปลี่ยนรหัสผ่าน
│   └── system-configs/        # ตั้งค่าระบบ (roles, menus, houses, pens, house-types, management-roles)
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.vue        # เมนูหลัก (สร้างจาก roleId.menuIds ที่ populate มาจาก API)
│   │   ├── Topbar.vue
│   │   └── BackOfficeLayout.vue
│   ├── base/                  # UI components ทั่วไป (Modal, DatePicker, Table, Form, ...)
│   ├── pig-batches/
│   │   ├── ModalForm.vue      # สร้าง/แก้ไขล็อตหมู (vee-validate + zod)
│   │   └── ModalTx.vue        # บันทึก transaction ล็อตหมู
│   ├── feed-stocks/
│   │   └── ModalTx.vue        # รับเข้า/เบิกใช้อาหาร (vee-validate + zod)
│   └── ...
│
└── layouts/
    └── back-office.vue        # Layout หลัก (Sidebar + Topbar)
```

---

## Auth Flow

1. ผู้ใช้กรอก email + password → `POST /api/auth/login`
2. รับ `token` + `refreshToken` → เก็บใน `localStorage`
3. ทุก request แนบ `Authorization: Bearer <token>` อัตโนมัติใน `use-cms-fetch.ts`
4. เมื่อ token หมดอายุ → `use-cms-fetch.ts` ส่ง `POST /api/auth/refresh` อัตโนมัติ → ได้ token ใหม่
5. `GET /api/auth/me` → เก็บ profile (รวม roleId populate + menuIds) ไว้ใน `useProfile()` state

---

## Sidebar Menu

เมนูใน Sidebar สร้างแบบ dynamic จาก `profile.roleId.menuIds`  
(ข้อมูลได้จาก `GET /auth/me` ที่ server populate `roleId → menuIds` ให้ครบ)

- เมนู parent (ไม่มี `parentId`) แสดงเป็น group พับได้
- เมนู child (มี `parentId`) แสดงเป็น sub-item
- sort ตาม field `sort` ของแต่ละ menu

---

## Form Validation

ใช้ **vee-validate** + **Zod** สำหรับ form validation ใน modal ต่าง ๆ

```ts
// Pattern: Options API setup() + raw v-model inputs
const validationSchema = toTypedSchema(zod.object({
  quantity: zod.number({ required_error: 'กรุณาระบุจำนวน' }).min(1),
  transactionDate: zod.string().min(1, 'กรุณาระบุวันที่'),
}))

setup() {
  const { validate, setValues, errors } = useForm({ validationSchema })
  return { validate, setValues, formErrors: errors }
}

// ใน submit handler:
this.setValues({ quantity: this.form.quantity, transactionDate: this.form.date })
const { valid } = await this.validate()
if (!valid) return
```

vee-validate composables ถูก auto-import ผ่าน `nuxt.config.ts` → `imports.presets`  
(ยกเว้น `validate` เพราะชนกับ Nuxt 3 internal)

---

## Endpoint Constants

ทุก API path อยู่ใน [composables/api-service.ts](composables/api-service.ts)

```ts
// ตัวอย่าง
export const apiSvcPigBatches         = '/pig-batches'
export const apiSvcPigBatchesById     = (id: string) => `/pig-batches/${id}`
export const apiSvcPigBatchesTxById   = (id: string) => `/pig-batches/${id}/transactions`
export const apiSvcFeedStocksIn       = (id: string) => `/feed-stocks/${id}/in`
export const apiSvcFeedStocksOut      = (id: string) => `/feed-stocks/${id}/out`
```

---

## Tech Stack

| ไลบรารี | การใช้งาน |
|--------|----------|
| Nuxt 3 (SPA mode) | Frontend framework |
| Vue 3 + TypeScript | UI |
| Tailwind CSS | Styling |
| vee-validate + Zod | Form validation |
| @vuepic/vue-datepicker | Date picker |
| Flowbite | Modal components |
| Sarabun (Google Fonts) | Thai font |
