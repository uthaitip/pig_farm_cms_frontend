enum StatusPigBatchs {
    active = 'ACTIVE',
    inActive = 'CLOSED',
}

const StatusPigBatchsMsg: Record<string, string> = {
    [StatusPigBatchs.active]: 'กำลังเลี้ยง',
    [StatusPigBatchs.inActive]: 'ปิดรุ่นแล้ว',
}

const StatusPigBatchsColor: Record<string, string> = {
    [StatusPigBatchs.active]: 'bg-green-100 text-appsuccess',
    [StatusPigBatchs.inActive]: 'bg-gray-100 text-appgray',
}



enum StatusCustomer {
    active = 'ACTIVE',
    inActive = 'INACTIVE',
}

const StatusCustomerMsg: Record<string, string> = {
    [StatusCustomer.active]: 'ใช้งาน',
    [StatusCustomer.inActive]: 'ปิดใช้งาน',
}

const StatusCustomerColor: Record<string, string> = {
    [StatusCustomer.active]: 'bg-green-100 text-appsuccess',
    [StatusCustomer.inActive]: 'bg-gray-100 text-appgray',
}

enum StatusUser {
    active = 'active',
    inactive = 'inactive',
}

const StatusUserMsg: Record<string, string> = {
    [StatusUser.active]: 'ใช้งาน',
    [StatusUser.inactive]: 'ไม่ใช้งาน',
}

const StatusUserColor: Record<string, string> = {
    [StatusUser.active]: 'bg-green-100 text-appsuccess',
    [StatusUser.inactive]: 'bg-gray-100 text-appgray',
}

enum StatusPen {
    active = 'ACTIVE',
    full = 'FULL',
    maintenance = 'MAINTENANCE',
}

const StatusPenMsg: Record<string, string> = {
    [StatusPen.active]: 'ใช้งาน',
    [StatusPen.full]: 'เต็ม',
    [StatusPen.maintenance]: 'ซ่อมบำรุง',
}

const StatusPenColor: Record<string, string> = {
    [StatusPen.active]: 'bg-green-100 text-appsuccess',
    [StatusPen.full]: 'bg-yellow-100 text-yellow-700',
    [StatusPen.maintenance]: 'bg-gray-100 text-appgray',
}

enum StatusSale {
    draft = 'DRAFT',
    completed = 'COMPLETED',
    cancelled = 'CANCELLED',
}

const StatusSaleMsg: Record<string, string> = {
    [StatusSale.draft]: 'แบบร่าง',
    [StatusSale.completed]: 'เสร็จสิ้น',
    [StatusSale.cancelled]: 'ยกเลิก',
}

const StatusSaleColor: Record<string, string> = {
    [StatusSale.draft]: 'bg-yellow-100 text-yellow-600',
    [StatusSale.completed]: 'bg-green-100 text-appsuccess',
    [StatusSale.cancelled]: 'bg-gray-100 text-appgray',
}

export {
    StatusUser,
    StatusUserMsg,
    StatusUserColor,
    StatusPigBatchs,
    StatusPigBatchsMsg,
    StatusPigBatchsColor,
    StatusCustomer,
    StatusCustomerMsg,
    StatusCustomerColor,
    StatusPen,
    StatusPenMsg,
    StatusPenColor,
    StatusSale,
    StatusSaleMsg,
    StatusSaleColor,
}