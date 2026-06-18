enum SourceType {
    PURCHASED = 'PURCHASED',
    BORN = 'BORN'

}

const SourceTypeMsg: Record<SourceType | any, String> = {
    [SourceType.PURCHASED]: 'ซื้อมา',
    [SourceType.BORN]: 'เกิดในฟาร์ม'
}


const SourceTypePigColor: Record<string, string> = {
    [SourceType.PURCHASED]: 'bg-purple-100 text-purple-600',
    [SourceType.BORN]: 'bg-blue-100 text-blue-600',
}

export { SourceType, SourceTypeMsg, SourceTypePigColor }

