<template>
  <div>
    <div class="w-full pt-5 flex align-center justify-center">
      แสดง
      <span class="px-1 font-extrabold">{{ formatNumberComma(startItem) }}-{{ formatNumberComma(endItem) }}</span> จาก
      <span class="px-1 font-extrabold">{{ formatNumberComma(count) }}</span> รายการ
    </div>
    <div class="w-full pt-4 px-5 pb-5 flex align-center justify-center">
      <nav v-if="btnPageCount > 0" aria-label="Pagination">
        <ul class="flex items-center -space-x-px h-10 text-base gap-2">
          <li>
            <button type="button"
              class="flex items-center justify-center px-2 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              @click="onClickPrev">
              <UIBaseHeroIcon name="chevron-left" color="text-primary" size="h-6 w-6" />
            </button>
          </li>
          <li v-if="currentRangeBtnPage.slice(0)[0] > 1">
            <button type="button"
              class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              @click="() => onChangePage(1)">
              1
            </button>
          </li>
          <li v-if="currentRangeBtnPage.slice(0)[0] > 1">
            <div
              class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
              . . .
            </div>
          </li>
          <li v-for="page in currentRangeBtnPage" :key="`page_${page}`">
            <button type="button"
              class="flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 rounded-md" :class="[
        currentPage === page
          ? 'bg-primary text-white hover:opacity-75 hover:text-white'
          : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700',
      ]" @click="() => onChangePage(page)">
              {{ page }}
            </button>
          </li>
          <li v-if="allBtnPageCount > currentRangeBtnPage.slice(-1)[0]">
            <div class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white">
              . . .
            </div>
          </li>
          <li v-if="allBtnPageCount > currentRangeBtnPage.slice(-1)[0]">
            <button type="button"
              class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              @click="() => onChangePage(allBtnPageCount)">
              {{ allBtnPageCount }}
            </button>
          </li>
          <li>
            <button type="button"
              class="flex items-center justify-center px-2 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              @click="onClickNext">
              <UIBaseHeroIcon name="chevron-right" color="text-primary" size="h-6 w-6" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>


<script lang="ts">
export default {
  props: {
    componentKey: { type: String, default: () => Date.now().toLocaleString() },
    page: { type: Number, default: () => 1 },
    size: { type: Number, default: () => 10 },
    count: { type: Number, default: () => 0 },
    maxButtonCount: { type: Number, default: () => 5 },
  },
  setup(props: any) {
    let currentPage = useState<number>(
      `basePaginationCurrentPage_${props.componentKey}`,
      () => 1
    );
    let currentRangeBtnPage = useState<number[]>(
      `basePaginationCurrentRangeBtnPage_${props.componentKey}`,
      () => []
    );
    let btnPageCount = useState<number>(
      `basePaginationBtnPageCount_${props.componentKey}`,
      () => 5
    );
    let allBtnPageCount = useState<number>(
      `basePaginationAllBtnPageCount_${props.componentKey}`,
      () => 0
    );

    function setData(data: any) {
      currentPage.value = data.page;
      const countPage = data.count / data.size;
      allBtnPageCount.value = parseInt(countPage.toString());
      if (data.count % data.size > 0) {
        allBtnPageCount.value = allBtnPageCount.value + 1;
      }

      btnPageCount.value =
        allBtnPageCount.value < data.maxButtonCount
          ? allBtnPageCount.value
          : data.maxButtonCount;

      setRangeBtnPage();
    }

    function setRangeBtnPage() {
      currentRangeBtnPage.value = [];

      let indexCenter = (btnPageCount.value / 2) | 0;
      let pageStart = currentPage.value - indexCenter;
      let pageEnd = currentPage.value + (btnPageCount.value - indexCenter);

      if (pageStart < 1) {
        pageEnd = pageEnd + pageStart * -1;
        pageStart = 1;
      } else {
        pageEnd = pageEnd - 1;
      }

      if (pageEnd > allBtnPageCount.value) {
        pageStart = pageStart - (pageEnd - allBtnPageCount.value);
        pageEnd = allBtnPageCount.value;
      }

      for (let page = pageStart; page <= pageEnd; page++) {
        currentRangeBtnPage.value.push(page);
      }
    }

    return {
      currentPage,
      currentRangeBtnPage,
      btnPageCount,
      allBtnPageCount,
      setData,
      setRangeBtnPage,
    };
  },
  mounted() {
    this.setData(this.$props);
  },
  methods: {
    formatNumberComma(value: number): string {
      return (value ?? 0).toLocaleString('th-TH')
    },

    onClickPrev() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
      
      this.setRangeBtnPage();
      this.$emit("onChangePage", this.currentPage);
    },

    onClickNext() {
      if (this.currentPage < this.allBtnPageCount) {
        this.currentPage++;
      }
      
      this.setRangeBtnPage();
      this.$emit("onChangePage", this.currentPage);
    },

    onChangePage(page: number) {
      this.currentPage = page;
      this.setRangeBtnPage();
      this.$emit("onChangePage", this.currentPage);
    },
  },
  computed: {
    startItem: function () {
      if (this.count < 1) return 0;
      if (this.page < 1) return 1;

      const startItem = (Number(this.page) - 1) * Number(this.size);
      return isNaN(startItem) ? 1 : startItem + 1;
    },
    endItem: function () {
      const endItem = (Number(this.startItem) - 1) + Number(this.size);

      if (endItem > this.count) return this.count;
      return isNaN(endItem) ? 10 : endItem;
    }
  },
  watch: {
    page(n: any) {
      this.setData({ ...this.$props, page: n });
    },
    size(n: any) {
      this.setData({ ...this.$props, size: n });
    },
    count(n: any) {
      this.setData({ ...this.$props, count: n });
    },
  },
};
</script>