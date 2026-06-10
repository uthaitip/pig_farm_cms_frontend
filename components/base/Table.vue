<template>
  <div>
    <div :class="[{ 'relative overflow-x-auto': isScrollX }]">
      <table :class="[
      isScrollX ? 'table-auto' : 'table-auto sm:table-fixed',
      isBorder ? '' : 'border-separate border-spacing-y-[12px]',
      widthTable]" class="rounded bg-white">
        <thead class="text-xs text-white uppercase bg-primary hidden sm:table-header-group">
          <slot v-if="$slots['header-rows']" name="header-rows"></slot>
          <tr v-else>
            <th v-if="isMutiselect" class="px-2 py-3 border-y-2 rounded-l-md border-l-2 w-[5%]"
              :class="[{ 'border-r-2': isBorder }]">
              <UIBaseCheckbox v-if="!isSingleSelect" :field="{
      useForm: false,
      key: `all-checkbox-${id}`,
      checked: isSelectAll,
      disabled: isDisabledSelect,
      value: isSelectAll,
    }" align="center" bg="text-appsuccess" @onChange="onSelectAll" />
            </th>
            <th v-if="showRunning" scope="col" class="px-1 py-3 border-y-2 text-base w-[5%]" :class="[
      {
        'rounded-l-md border-l-2': !isMutiselect,
        'border-r-2': isBorder,
      },
    ]">
              ลำดับ
            </th>
            <template v-for="(option, index) in parseDefaultOptions" :key="`th_${option.field}`">
              <th v-if="!option.hidden" scope="col" class="px-1 py-3 border-y-2 text-base" :class="[
      {
        'border-r-2': isBorder,
        'rounded-l-md border-l-2': !isMutiselect &&
          index == 0 &&
          !showRunning,
        'rounded-r-md border-r-2':
          !enabledChildren && index == parseDefaultOptions.length - 1,
      },
      option.width,
      option.headerAlign,
    ]">
                {{ option.label }}
              </th>
            </template>
            <th v-if="enabledChildren" class="px-1 py-3 border-y-2 rounded-r-md border-r-2 w-[5%]"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!paginationData?.list?.length">
            <td :colspan="showRunning ? getOptionsNotHidden.length + 1 : getOptionsNotHidden.length">
              <div class="flex items-center justify-center">
                <div v-if="$slots['dataEmpty']">
                  <slot name="dataEmpty"></slot>
                </div>

                <div v-else class="mt-10 mb-4 grid grid-cols-1 items-center justify-items-center gap-y-2">
                  <i class="fi fi-rr-window-alt text-appgray text-5xl"></i>
                  <span class="text-appgray font-semibold">ไม่พบข้อมูล</span>
                </div>
              </div>
            </td>
          </tr>
          <template v-for="(item, index) in (paginationData?.list ?? [])" :key="`data_${index}`">
            <tr class="table-row bg-white hover:bg-gray-50 sm:hidden">
              <td class="p-1 border-b-2 border-gray" :colspan="getColspanData(options)">
                <div v-if="showRunning" class="grid grid-cols-3">
                  <div class="font-black">ลำดับ</div>
                  <div class="col-span-2">
                    <div class="flex justify-start items-center">
                      {{ getRunning(index) }}
                    </div>
                  </div>
                </div>
                <template v-for="(option) in parseDefaultOptions" :key="`td_${option.field}`">
                  <div class="grid grid-cols-3">
                    <div class="font-black">{{ option.label }} </div>
                    <div class="col-span-2">
                      <div class="flex justify-start items-center">
                        <template v-if="$slots[option.field]">
                          <slot :name="option.field" :key="`option_${index}`" :data="{ ...item, index: index }"></slot>
                        </template>
                        <div v-else-if="option.field && item[option.field]" :key="`option_${index}`"
                          class="line-clamp-3" :class="option.dataAlign">
                          {{ item[option.field] }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </td>
            </tr>
            <tr class="hidden sm:table-row" :class="[highlight?.(item, 'bg-white hover:bg-gray-50')]" @click="onClickRow(item)">
              <td v-if="isMutiselect" class="p-1 border-y-2 border-gray" :class="[
      {
        'border-r-2': isBorder,
        'rounded-l-md border-l-2': !isShowChildren(item) || (isShowChildren(item) && !isExpanded(index)),
        'rounded-tl-md border-l-2': isShowChildren(item) && isExpanded(index),
      },
    ]">
                <div class="flex justify-center items-center">
                  <UIBaseCheckbox :field="{
      useForm: false,
      key: `checkbox-item-${index}-${getDataByFieldKey(index)}`,
      checked: isSelected(item),
      disabled: isDisabledSelect || isDisabledSelected(item),
      value: isSelected(item) || isDisabledSelected(item),
    }" align="center" @onChange="(e) => onSelectItem(e, item)" />
                </div>
              </td>
              <td v-if="showRunning" class="p-1 border-y-2 border-gray text-center" :class="[
      {
        'border-r-2': isBorder,
        'rounded-l-md border-l-2': !isMutiselect && !isShowChildren(item) || (isShowChildren(item) && !isExpanded(index)),
        'rounded-tl-md border-l-2': !isMutiselect && isShowChildren(item) && isExpanded(index),
        'border-b-0': isExpanded(index) && isShowChildren(item),
      },
    ]">
                {{ getRunning(index) }}
              </td>
              <template v-for="(option, optionIndex) in parseDefaultOptions" :key="`td_${option.field}`">
                <td v-if="!option.hidden" class="w-4 px-1 py-2 border-y-2 border-gray" :class="[
      {
        'border-r-2': isBorder &&
          optionIndex != parseDefaultOptions.length - 1,
        'rounded-l-md border-l-2':
          !isMutiselect &&
          !isShowChildren(item) &&
          optionIndex == 0 &&
          !showRunning,
        'rounded-tl-md border-l-2':
          !isMutiselect &&
          isShowChildren(item) &&
          optionIndex == 0 &&
          !showRunning,
        'rounded-r-md border-r-2':
          !enabledChildren &&
          optionIndex == parseDefaultOptions.length - 1,
        'border-b-0': isExpanded(index) && isShowChildren(item),
      },
      option.width,
    ]">
                  <template v-if="$slots[option.field]">
                    <slot :name="option.field" :key="`option_${index}`" :data="{ ...item, index: index }"></slot>
                  </template>
                  <div v-else-if="option.field && item[option.field] != null && item[option.field] != undefined"
                    :key="`option_${index}`" class="line-clamp-3" :class="option.dataAlign">
                    {{ item[option.field] }}
                  </div>
                </td>
              </template>

              <td v-if="enabledChildren" class="w-[3%] border-y-2 border-gray rounded-tr-md border-r-2" :class="[
      {
        'border-b-0': isExpanded(index) && isShowChildren(item),
        'rounded-br-md': !isExpanded(index),
      },
    ]" @click="() => onClickToggleChildren(index)">
                <UIBaseHeroIcon v-if="isShowChildren(item)" :name="isExpanded(index) ? 'chevron-up' : 'chevron-down'"
                  color="text-primary " class="rounded-[50%] bg-gray-100 p-1" />
              </td>
            </tr>
            <template v-if="!!isShowChildren(item) && isExpanded(index)">
              <tr>
                <!-- +2 = 1:ลำดับ, 2:icon expanded and collapse  -->
                <td :colspan="parseDefaultOptions.length + 2"
                  class="px-4 pb-4 border-2 border-t-0 rounded-bl-md rounded-br-md bg-gray-100">
                  <table :class="[isScrollX ? 'table-auto' : 'table-auto sm:table-fixed', widthTable]"
                    class=" rounded bg-transparent border-separate border-spacing-y-[8px]">
                    <thead class="text-xs text-primary uppercase bg-blue-100">
                      <tr>
                        <!-- !enabledChildren && -->
                        <th v-if="showRunning" scope="col" class="px-1 py-3 border-y-2 w-[10%] rounded-l-md border-l-2">
                          ลำดับ
                        </th>
                        <th v-for="(option, index) in parseDefaultChildrenOptions" :key="`th_${option.field}`"
                          scope="col" class="px-1 py-3 border-y-2" :class="[
      {
        'rounded-l-md border-l-2': index == 0 && !showRunning,
        'rounded-r-md border-r-2':
          index == parseDefaultChildrenOptions.length - 1,
      },
      option.width,
      option.headerAlign,
    ]">
                          {{ option.label }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(child, indexChild) in item.children" :key="`data_${index}_child_${indexChild}`"
                        class="bg-white hover:bg-gray-50">

                        <td v-if="showRunning" class="p-1 border-y-2 border-gray text-center rounded-l-md border-l-2">
                          {{ indexChild + 1 }}
                        </td>
                        <td class="w-4 px-1 py-2 border-y-2 border-gray" v-for="(
                          optionChild, optionChildIndex
                        ) in parseDefaultChildrenOptions" :key="`td_${optionChild.field}`" :class="[
      {
        'rounded-l-md border-l-2': optionChildIndex == 0 && !showRunning,
        'rounded-r-md border-r-2':
          optionChildIndex ==
          parseDefaultChildrenOptions.length - 1,
        // 'border-b-0': isExpanded(index),
      },
    ]">
                          <template v-if="$slots[`children-${optionChild.field}`]">
                            <slot :name="`children-${optionChild.field}`"
                              :key="`option_${index}_child_${optionChildIndex}`" :data="{
      ...child,
      index: index,
      indexChild: indexChild,
    }" :data-parent="{
      ...item,
      index: index,
    }"></slot>
                          </template>
                          <div v-else-if="child && optionChild.field && optionChild.field in child && child[optionChild.field]
      " :key="`option_${index}_child_${optionChildIndex}`" :class="optionChild.dataAlign" class="line-clamp-3">
                            {{ child[optionChild.field] }}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
        <tfoot>
          <slot name="footer-rows"></slot>
        </tfoot>
      </table>
    </div>
    <div v-if="!!dataPagination && paginationData.page" >
      <UIBasePagination :count="paginationData.total" :size="paginationData.limit" :page="paginationData.page"
        @onChangePage="onChangePage" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    id: {
      type: String,
      default: () => {
        const date = new Date();
        return date.getTime().toString() ?? "";
      },
    },
    options: { type: Array<any>, required: true },
    childrenOptions: { type: Array<any>, default: () => [] },
    dataList: { type: Array<any>, default: () => [] },
    dataPagination: { type: [Pagination<any>, Object] },
    enabledChildren: { type: Boolean, default: false },
    isMutiselect: { type: Boolean, default: false },
    isSingleSelect: { type: Boolean, default: false },
    isDisabledSelect: { type: Boolean, default: false },
    showRunning: { type: Boolean, default: false },
    initSelected: { type: Array<any>, default: () => [] },
    isScrollX: { type: Boolean, default: () => false },
    widthTable: { type: String, default: () => 'w-full' },
    isBorder: { type: Boolean, default: () => false },
    highlight: { type: Function, default: () => "bg-white hover:bg-gray-50" }
  },
  emits: ["onSelected", "onChangePage","onClickRow"],
  setup() { },
  computed: {
    parseDefaultOptions(): any[] {
      const tableOption = new TableOption({});
      return this.options.map((e: any) => ({ ...tableOption, ...e }));
    },
    parseDefaultChildrenOptions(): any[] {
      const tableOption = new TableOption({});
      if (!!this.childrenOptions?.length) {
        return this.childrenOptions.map((e: any) => ({ ...tableOption, ...e }));
      }
      return this.options.map((e: any) => ({ ...tableOption, ...e }));
    },
    fieldKey() {
      return this.options.find((e: any) => e.isKey)?.field;
    },
    getOptionsNotHidden(): any[] {
      return this.parseDefaultOptions?.filter((e: any) => !e.hidden) ?? [];
    }
  },
  mounted() {
    this.selectedList = [...(this.initSelected?.filter((e: any) => !!e) ?? [])];
    if (!!this.dataPagination) {
      this.paginationData = this.dataPagination as IPagination<any>;
    } else {
      this.paginationData = new Pagination<any>({
        page: 1,
        limit: 10,
        list: (this.dataList ?? []),
      })
    }
  },
  data() {
    return {
      paginationData: new Pagination<any>({
        page: 1,
        limit: 10,
        list: [],
      }) as IPagination<any>,
      expandList: [] as string[],
      selectedList: [] as any[],
      isSelectAll: false as boolean,
    };
  },
  methods: {
    isShowChildren(item: any): Boolean {
      return this.enabledChildren && !!item.children?.length;
    },
    isExpanded(index: any) {
      return this.expandList.includes(index);
    },
    onClickToggleChildren(index: any) {
      if (this.isExpanded(index)) {
        const indexDelete = this.expandList.indexOf(index);
        this.expandList.splice(indexDelete, 1);
      } else {
        this.expandList.push(index);
      }
    },
    onSelectAll(data: any) {
      if (!!data.checked) {
        this.isSelectAll = true;
        this.selectedList = this.paginationData.list
          ?.filter((e: any) => !!e)
          ?.map((e: any) => e) ?? [];
      } else {
        this.isSelectAll = false;
        this.selectedList = [];
      }
      this.$emit("onSelected", { selectedList: this.selectedList });
    },
    onSelectItem(data: any, item: any) {
      const index = this.selectedList
        ?.filter((e: any) => !!e)
        ?.findIndex((e: any) => e[this.fieldKey] == item[this.fieldKey]);

      if (this.isSingleSelect) {
        // Single select mode: allow only one item to be selected
        if (index > -1) {
          // Unselect if clicking the same item
          this.selectedList = [];
        } else {
          // Select only this item
          this.selectedList = [item];
        }
      } else {
        // Multi select mode: original behavior
        if (index > -1) {
          this.isSelectAll = false;
          this.selectedList.splice(index, 1);
        } else if (!!data.checked) {
          this.selectedList.push(item);
        }
      }
      this.$emit("onSelected", {
        checked: !!data.checked,
        selectedItem: item,
        selectedList: this.selectedList,
      });
    },
    isSelected(item: any) {
      if (this.fieldKey && item[this.fieldKey]) {
        return !!this.selectedList.find(
          (e: any) => !!e && !!item && e[this.fieldKey] == item[this.fieldKey]
        );
      }
      return false;
    },
    isDisabledSelected(item: any) {
      return item.disabled;
    },
    getDataByFieldKey(index: any) {
      if (!!this.fieldKey &&
        this.paginationData?.list?.length &&
        this.paginationData?.list?.length > index) {
        return this.paginationData.list[index][this.fieldKey];
      }
      return "";
    },

    onChangePage(page: number) {
      this.isSelectAll = false;
      this.$emit("onChangePage", page);
    },

    onClickRow(item: any) {
      this.$emit("onClickRow", item);
    },

    getColspanData(options: any) {
      const colsLength = options.filter((o: any) => !o.hidden).length;
      return this.showRunning ? colsLength + 1 : colsLength;
    },

    getRunning(index: number) {
      const pageIndex = (this.paginationData?.page ?? 1) - 1;
      const perPage = this.paginationData.limit ?? 10;
      const currentNo = index + 1;
      return (pageIndex * perPage) + currentNo;
    }
  },
  watch: {
    initSelected: function (n: any[]) {
      if (!n?.length) {
        this.isSelectAll = false;
      }

      this.selectedList = [...n.filter((e: any) => !!e)];
    },

    dataPagination: function (n: IPagination<any>) {
      this.paginationData = n;
    },

    dataList: function (n: Array<any>) {
      if (!!n) {
        this.paginationData = new Pagination<any>({
          page: 1,
          limit: 10,
          list: [...(n ?? [])],
        })
      }
    },
  },
};
</script>