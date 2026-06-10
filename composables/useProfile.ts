// Global profile state — persists in-memory, re-fetched on page load via auth.client plugin
export const useProfile = () => useState<any>('profile', () => null)
