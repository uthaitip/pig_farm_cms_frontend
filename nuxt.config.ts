import { resolve } from 'path'

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },

  app: {
    buildAssetsDir: '_nuxt_pic_cms',
    head: {
      title: 'Pig Farm CMS',
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/pig.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&display=swap' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      appVersion: process.env.APP_VERSION || '1.0',
      apiCms: process.env.API_CMS || 'http://localhost:8000/api',
    },
  },

  css: [
    '~/assets/css/input.css',
    '@vuepic/vue-datepicker/dist/main.css',
  ],

  build: {
    transpile: ['@vuepic/vue-datepicker'],
  },

  modules: ['@nuxtjs/tailwindcss'],

  components: [{ path: '~/components', prefix: 'UI' }],

  imports: {
    dirs: ['composables/**'],
    transform: {
      // Prevent unimport from injecting auto-imports into Nuxt virtual modules
      // (fixes 'validate already declared' conflict with Nuxt 3.16 internal middleware)
      exclude: [/\bnode_modules\b/, /\.nuxt\//],
    },
    presets: [
      {
        from: 'vee-validate',
        imports: [
          'useField', 'useForm', 'useFieldArray', 'useFieldError', 'useFieldValue',
          'useFormContext', 'useFormErrors', 'useFormValues', 'useIsFieldDirty',
          'useIsFieldTouched', 'useIsFieldValid', 'useIsFormDirty', 'useIsFormTouched',
          'useIsFormValid', 'useIsSubmitting', 'useIsValidating', 'useResetForm',
          'useSetFieldError', 'useSetFieldTouched', 'useSetFieldValue',
          'useSetFormErrors', 'useSetFormTouched', 'useSetFormValues',
          'useSubmitCount', 'useSubmitForm', 'useValidateField', 'useValidateForm',
          'defineRule', 'configure', 'ErrorMessage', 'Field', 'FieldArray', 'Form',
          // 'validate' ตั้งใจ ไม่ใส่ เพราะชนกับ Nuxt internal
        ],
      },
    ],
  },

  // Workaround: @nuxt/schema sets alias['#build'] = withTrailingSlash(buildDir)
  // which causes VirtualFSPlugin to resolve '#build/fetch.mjs' → '/app/.nuxt//fetch.mjs'
  // (double slash), breaking VFS key lookup in Docker. Override without trailing slash.
  alias: {
    '#build': resolve(process.cwd(), '.nuxt'),
  },

  experimental: {
    appManifest: false,
  },

  compatibilityDate: '2024-12-20',
})
