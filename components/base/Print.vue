<template>
  <div>
    <div
      id="globalBasePrintContainer"
      class="hidden min-h-screen min-w-screen on-print"
    >
      <p v-html="htmlStr"></p>
    </div>
  </div>
</template>


<script lang="ts">
export default {
  setup() {
    const globalBasePrintValuesState = useState<any>(
      "globalBasePrintValues",
      () => ({ elementId: "" })
    );

    const globalBasePrintState = useState<any>("globalBasePrint", () => ({
      print: (id: string) => {
        globalBasePrintValuesState.value = { elementId: id };
      },
    }));

    return { globalBasePrintState, globalBasePrintValuesState };
  },
  mounted() {
    watchEffect(() => {
      if (!!this.globalBasePrintValuesState?.elementId) {
        this.onShow(this.globalBasePrintValuesState?.elementId);
      }
    });
  },
  data() {
    return {
      htmlStr: "",
    };
  },
  methods: {
    onShow(id: any) {
      setTimeout(() => {
        let printEle = document.getElementById(id);

        this.htmlStr = printEle?.innerHTML ?? "";

        setTimeout(() => {
          window.print();
        }, 100);
      }, 100);
    },
  },
  computed: {},
};
</script>