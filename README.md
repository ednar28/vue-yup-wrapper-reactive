# Vue Yup Wrapper Reactive

Plugin Vue 3 composable yang mengintegrasikan validasi Yup dengan sistem reaktif Vue untuk manajemen form yang mudah dan type-safe.

## Fitur

- ✅ **Vue 3 Composition API** - Menggunakan composable pattern
- ✅ **TypeScript Support** - Full type safety
- ✅ **Yup Integration** - Validasi schema yang powerful
- ✅ **Reactive State** - State management otomatis dengan Vue reactivity
- ✅ **Custom Field Labels** - Pemetaan label field untuk internationalization
- ✅ **Error Handling** - Penanganan error yang komprehensif
- ✅ **Reset Functionality** - Reset form ke nilai awal

## Instalasi

```bash
npm install vue-yup-wrapper-reactive
# atau
yarn add vue-yup-wrapper-reactive
# atau
pnpm add vue-yup-wrapper-reactive
```

## Penggunaan Dasar

```typescript
import { useYupForm, YUP } from 'vue-yup-wrapper-reactive'

// Definisikan konfigurasi form
const formConfig = {
  name: ['', YUP.string().required('Name is required')],
  email: ['', YUP.string().email('Invalid email').required('Email is required')],
  age: [0, YUP.number().min(18, 'Must be at least 18 years old').required('Age is required')],
} as const

// Gunakan dalam component Vue
export default {
  setup() {
    const { form, errors, validate, reset } = useYupForm(formConfig)

    const handleSubmit = async () => {
      const isValid = await validate()
      if (isValid) {
        console.log('Form data:', form)
        // Proses form data
      } else {
        console.log('Validation errors:', errors.value)
      }
    }

    return {
      form,
      errors,
      validate,
      reset,
      handleSubmit
    }
  }
}
```

## Penggunaan dengan Custom Labels

```typescript
const formConfig = {
  name: ['', YUP.string().required('Name is required'), 'Nama Lengkap'],
  email: ['', YUP.string().email('Invalid email').required('Email is required'), 'Alamat Email'],
  age: [0, YUP.number().min(18, 'Must be at least 18 years old').required('Age is required'), 'Umur'],
} as const

const { form, errors, validate, reset, getFieldLabel, fieldLabels } = useYupForm(formConfig)

// Akses label field
console.log(getFieldLabel('name')) // 'Nama Lengkap'
console.log(fieldLabels.email) // 'Alamat Email'
```

## Template Vue

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>{{ getFieldLabel('name') }}:</label>
      <input v-model="form.name" type="text" />
      <span v-if="errors.name" class="error">{{ errors.name }}</span>
    </div>

    <div>
      <label>{{ getFieldLabel('email') }}:</label>
      <input v-model="form.email" type="email" />
      <span v-if="errors.email" class="error">{{ errors.email }}</span>
    </div>

    <div>
      <label>{{ getFieldLabel('age') }}:</label>
      <input v-model.number="form.age" type="number" />
      <span v-if="errors.age" class="error">{{ errors.age }}</span>
    </div>

    <button type="submit">Submit</button>
    <button type="button" @click="reset">Reset</button>
  </form>
</template>
```

## API Reference

### `useYupForm(config)`

#### Parameters

- `config`: Object dengan format `{ fieldName: [defaultValue, yupSchema, optionalLabel] }`

#### Returns

- `form`: Reactive object berisi nilai form
- `errors`: Ref object berisi error messages
- `validate()`: Function untuk validasi form (returns Promise<boolean>)
- `reset()`: Function untuk reset form ke nilai awal
- `getFieldLabel(fieldKey)`: Function untuk mendapatkan label field
- `fieldLabels`: Object mapping semua field labels

### Exported Utilities

- `YUP`: Yup library instance
- `YUP_OBJECT`: Yup.object() shorthand
- `version`: Plugin version
- `pluginInfo`: Plugin information

## Contoh Lengkap

```vue
<script setup lang="ts">
import { useYupForm, YUP } from 'vue-yup-wrapper-reactive'

const formConfig = {
  firstName: ['', YUP.string().required('First name is required'), 'Nama Depan'],
  lastName: ['', YUP.string().required('Last name is required'), 'Nama Belakang'],
  email: ['', YUP.string().email('Invalid email').required('Email is required'), 'Email'],
  password: ['', YUP.string().min(6, 'Password must be at least 6 characters').required('Password is required'), 'Password'],
  confirmPassword: ['', YUP.string().oneOf([YUP.ref('password')], 'Passwords must match').required('Confirm password is required'), 'Konfirmasi Password'],
  age: [0, YUP.number().min(18, 'Must be at least 18 years old').required('Age is required'), 'Umur'],
  terms: [false, YUP.boolean().oneOf([true], 'You must accept terms and conditions'), 'Syarat & Ketentuan']
} as const

const { form, errors, validate, reset, getFieldLabel } = useYupForm(formConfig)

const handleSubmit = async () => {
  const isValid = await validate()
  if (isValid) {
    alert('Form submitted successfully!')
    console.log('Form data:', form)
  }
}
</script>

<template>
  <div class="form-container">
    <h2>Registration Form</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>{{ getFieldLabel('firstName') }}:</label>
        <input v-model="form.firstName" type="text" />
        <span v-if="errors.firstName" class="error">{{ errors.firstName }}</span>
      </div>

      <div class="form-group">
        <label>{{ getFieldLabel('lastName') }}:</label>
        <input v-model="form.lastName" type="text" />
        <span v-if="errors.lastName" class="error">{{ errors.lastName }}</span>
      </div>

      <div class="form-group">
        <label>{{ getFieldLabel('email') }}:</label>
        <input v-model="form.email" type="email" />
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label>{{ getFieldLabel('password') }}:</label>
        <input v-model="form.password" type="password" />
        <span v-if="errors.password" class="error">{{ errors.password }}</span>
      </div>

      <div class="form-group">
        <label>{{ getFieldLabel('confirmPassword') }}:</label>
        <input v-model="form.confirmPassword" type="password" />
        <span v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</span>
      </div>

      <div class="form-group">
        <label>{{ getFieldLabel('age') }}:</label>
        <input v-model.number="form.age" type="number" />
        <span v-if="errors.age" class="error">{{ errors.age }}</span>
      </div>

      <div class="form-group">
        <label>
          <input v-model="form.terms" type="checkbox" />
          {{ getFieldLabel('terms') }}
        </label>
        <span v-if="errors.terms" class="error">{{ errors.terms }}</span>
      </div>

      <div class="form-actions">
        <button type="submit">Submit</button>
        <button type="button" @click="reset">Reset</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error {
  color: red;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #007bff;
  color: white;
}

button[type="button"] {
  background-color: #6c757d;
  color: white;
}
</style>
```

## Requirements

- Vue 3.x
- Yup 1.x
- TypeScript (recommended)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.