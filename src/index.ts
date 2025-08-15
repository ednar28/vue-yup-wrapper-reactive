// Vue Yup Wrapper Reactive - Main Entry Point
// Export all public APIs

export { useYupForm, YUP, YUP_OBJECT } from './useForm'

// Re-export types for better developer experience
export type { Schema } from 'yup'

// Version info
export const version = '1.0.0'

// Plugin info
export const pluginInfo = {
  name: 'vue-yup-wrapper-reactive',
  version: '1.0.0',
  description: 'Vue 3 composable plugin that integrates Yup validation with Vue reactive system',
  author: 'Your Name'
}