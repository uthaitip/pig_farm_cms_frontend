export const useLoading = () => {
  const ctrl = useState<{ show: (options?: any) => void; hide: () => void } | null>('globalBaseLoading', () => null)
  return {
    show: (text?: string) => ctrl.value?.show(text ? { text } : {}),
    hide: ()             => ctrl.value?.hide(),
  }
}
