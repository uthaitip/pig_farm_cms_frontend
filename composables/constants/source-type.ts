enum SourceType {
    PURCHASED = 'PURCHASED',
    BORN = 'BORN'

}

const SourceTypeMsg: Record<SourceType | any, String> = {
    [SourceType.PURCHASED]: 'ซื้อมา',
    [SourceType.BORN]: 'เกิดในฟาร์ม'
}

export { SourceType, SourceTypeMsg }

