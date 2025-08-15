import { reactive, ref } from 'vue'
import * as Yup from 'yup'

export const YUP = Yup
export const YUP_OBJECT = Yup.object

type FormValue = unknown
type FormField<T extends FormValue> = [T, Yup.Schema<T>, string?] // Tambahkan parameter ketiga optional untuk rename
type FormConfig = Record<string, FormField<FormValue>>

// Example usage:
// const formConfig = {
//   name: ['', YUP.string().required('Name is required'), 'Nama'],
//   email: ['', YUP.string().email('Invalid email').required('Email is required')],
//   age: [0, YUP.number().min(18, 'Must be at least 18 years old').required('Age is required')],
//   password: ['', YUP.string().min(6, 'Password must be at least 6 characters').required('Password is required')],
// } as const

// Using the form:
// const { form, errors, validate, reset } = useYupForm(formConfig)

// Access form values
// console.log(form.name) // ''
// console.log(form.email) // ''
// console.log(form.age) // 0
// console.log(form.password) // ''

// Validate the form
// await validate()

// Check for errors
// console.log(errors.value) // Shows validation errors if any

// Reset form to initial values
// reset()

export function useYupForm<T extends FormConfig>(config: T) {
  const initialValues = Object.entries(config).reduce((acc, [key, [value]]) => {
    acc[key as keyof typeof acc] = value
    return acc
  }, {} as { [K in keyof T]: T[K][0] })

  const schema = YUP_OBJECT().shape(
    Object.entries(config).reduce((acc, [key, [_, validator, label]]) => {
      // Clone validator dan set custom label untuk error messages
      const customValidator = validator.clone()

      // Jika ada label, gunakan untuk error messages
      if (label) {
        // Override error messages untuk menggunakan label
        customValidator.label(label)
      }

      acc[key as keyof typeof acc] = customValidator
      return acc
    }, {} as { [K in keyof T]: T[K][1] }),
  )

  // Tambahkan fungsi untuk mendapatkan field labels/names
  const getFieldLabel = (fieldKey: keyof T): string => {
    const fieldConfig = config[fieldKey]
    return fieldConfig[2] || String(fieldKey) // Gunakan rename jika ada, atau field key asli
  }

  // Tambahkan object untuk mapping field labels
  const fieldLabels = Object.entries(config).reduce((acc, [key, [_, __, label]]) => {
    acc[key as keyof typeof acc] = label || key
    return acc
  }, {} as { [K in keyof T]: string })

  const form = reactive({ ...initialValues })
  const errors = ref<Partial<Record<keyof T, string>> | Record<string, never>>({})

  async function validate(): Promise<boolean> {
    try {
      await schema.validate(form, { abortEarly: false })
      errors.value = {} // clear all errors
      return true
    } catch (err) {
      if (err instanceof Yup.ValidationError && Array.isArray(err.inner)) {
        const newErrors = {}
        err.inner.forEach((error) => {
          if (error.path) {
            // Dapatkan label field yang sudah di-rename
            const fieldLabel = getFieldLabel(error.path as keyof T)
            // Ganti field name dalam error message dengan label yang sudah di-rename
            const customMessage = error.message.replace(
              new RegExp(`\\b${error.path}\\b`, 'gi'),
              fieldLabel,
            )
            Object.assign(newErrors, { [error.path]: customMessage })
          }
        })

        errors.value = newErrors
      } else {
        // Handle unexpected errors
        console.error('Validation error:', err)
        // state.errors = { _form: 'An unexpected error occurred' } as Partial<Record<keyof T, string>>;
      }
      return false
    }
  }

  const reset = () => {
    Object.assign(form, initialValues)
    errors.value = {}
  }

  return {
    form,
    errors,
    reset,
    validate,
    getFieldLabel, // Export fungsi untuk mendapatkan label field
    fieldLabels, // Export object mapping field labels
  }
}