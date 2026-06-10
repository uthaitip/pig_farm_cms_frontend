import { initFlowbite } from 'flowbite'

export default defineNuxtPlugin(() => {
  // re-init Flowbite on every route change (SPA navigation)
  const router = useRouter()
  if (router) {
    router.afterEach(() => {
      nextTick(() => initFlowbite())
    })
  }
  // init on first load
  nextTick(() => initFlowbite())
})
