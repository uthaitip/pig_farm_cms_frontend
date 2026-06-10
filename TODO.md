# Frontend TODO

## 1. ลบไฟล์ที่ไม่ได้ใช้แล้ว

| ไฟล์ | เหตุผล |
|---|---|
| `composables/api-main.ts` | ซ้ำกับ `composables/api.ts` ไม่มีใครใช้อ้างอิง |
| `composables/use-bff-fetch.ts` | ไม่มีหน้าไหนใช้แล้ว ใช้ `$fetch` ตรงๆ แทน |
| `composables/constants/routes.ts` | มีแค่ 4 ค่าคงที่ ไม่มีใครใช้ |
| `stores/` (directory ว่าง) | ลบออก |

---

## 2. ไฟล์ที่ยังใช้ pattern เก่า (use-cms-fetch)

ไฟล์เหล่านี้ยังเรียก `cmsPost` / `cmsPut` / `cmsPatch` / `cmsDelete` จาก `use-cms-fetch.ts`  
ควรเปลี่ยนเป็น `useFetchPostClient` / `useFetchPutClient` / `useFetchDeleteClient` ให้ตรงกับ pattern ใหม่

| ไฟล์ | calls ที่ต้องเปลี่ยน |
|---|---|
| `pages/customers/index.vue` | `cmsPost`, `cmsPut`, `cmsDelete` |
| `pages/login.vue` | `cmsPost` (login) |
| `pages/profile.vue` | `cmsPut` (update profile), `cmsPatch` (change password) |

> หลังจากเปลี่ยนครบแล้ว ลบ `composables/use-cms-fetch.ts` ได้เลย

---

## 3. หน้าซ้ำซ้อน

| หน้า | ปัญหา |
|---|---|
| `pages/users/index.vue` | ซ้ำกับ `pages/system-configs/users/index.vue` — ควรเลือกใช้อันเดียว แล้วลบอีกอันออก |

---

## 4. หน้าที่ยังไม่ได้ทำ / ยังไม่สมบูรณ์

| หน้า | สถานะ |
|---|---|
| `pages/report/index.vue` | ยังว่างอยู่ ยังไม่มี logic |
| `pages/pigs/index.vue` | ยังใช้ `:data-list` (ไม่มี pagination) — ถ้าข้อมูลเยอะควรเพิ่ม pagination |

---

## 5. Backend seed ที่ต้อง re-run หลังแก้ไข

```bash
cd pig-farm-service
npx tsx src/seeds/menu.seed.ts
```

> ลบ "งานที่ต้องทำ" (/todos) ออกจาก seed แล้ว ต้อง run ใหม่เพื่อให้ DB อัปเดต
