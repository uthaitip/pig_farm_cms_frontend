<template>
  <div></div>
</template>

<script lang="ts">
export default {
  setup() {
    definePageMeta({ layout: 'back-office' })
    const profile = useProfile()
    const loading = useLoading()
    return { profile, loading }
  },
  data() {
    return {
      _timer: null as ReturnType<typeof setInterval> | null,
    }
  },
  mounted() {
    this.loading.show()

    const max = 10
    let tick = 0

    this._timer = setInterval(() => {
      if (this.profile) {
        clearInterval(this._timer!)
        this.loading.hide()
        navigateTo('/dashboard')
        return
      }
      if (tick >= max) {
        clearInterval(this._timer!)
        this.loading.hide()
        navigateTo('/dashboard')
      }
      tick++
    }, 500)
  },
  beforeUnmount() {
    if (this._timer) clearInterval(this._timer)
  },
}
</script>
