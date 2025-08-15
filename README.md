# Vue Yup Wrapper Reactive

[![npm version](https://badge.fury.io/js/vue-yup-wrapper-reactive.svg)](https://badge.fury.io/js/vue-yup-wrapper-reactive)
[![npm downloads](https://img.shields.io/npm/dm/vue-yup-wrapper-reactive.svg)](https://www.npmjs.com/package/vue-yup-wrapper-reactive)
[![GitHub license](https://img.shields.io/github/license/ednar28/vue-yup-wrapper-reactive.svg)](https://github.com/ednar28/vue-yup-wrapper-reactive/blob/main/LICENSE)

A Vue 3 plugin that simplifies form validation with Yup integration. This library provides a streamlined approach to implementing form validation in Vue 3 applications using the Composition API.

The plugin offers a declarative way to integrate Yup validation schemas with Vue's reactive system, providing type-safe form handling with minimal boilerplate code.

## Overview

Vue Yup Wrapper Reactive addresses the common challenges of form validation in Vue 3 applications by providing a composable that seamlessly integrates Yup validation schemas with Vue's reactivity system.

### Key Features

- **Vue 3 Composition API**: Built using the composable pattern for optimal integration
- **Full TypeScript Support**: Complete type safety with comprehensive type definitions
- **Seamless Yup Integration**: Direct integration with Yup validation library
- **Automatic State Management**: Leverages Vue's reactivity system for state handling
- **Custom Field Labels**: Support for internationalization and custom field naming
- **Comprehensive Error Handling**: Detailed error reporting and validation feedback
- **Form Reset Functionality**: Built-in methods for form state management

## Installation

```bash
npm install vue-yup-wrapper-reactive
```

Alternatively, using yarn or pnpm:
```bash
yarn add vue-yup-wrapper-reactive
pnpm add vue-yup-wrapper-reactive
```

## Usage

To get started, import the composable and define your form configuration:

```typescript
import { useYupForm, YUP } from 'vue-yup-wrapper-reactive'

// Define form configuration
const formConfig = {
  name: ['', YUP.string().required()],
  email: ['', YUP.string().email().required()],
  age: [0, YUP.number().min(18).required()],
} as const

// In Vue component
export default {
  setup() {
    const { form, errors, validate, reset } = useYupForm(formConfig)

    const handleSubmit = async () => {
      const isValid = await validate()
      if (isValid) {
        console.log('Form data:', form)
        // Process form data here
      } else {
        console.log('Validation errors:', errors.value)
      }
    }

    return { form, errors, validate, reset, handleSubmit }
  }
}
```

## Custom Field Labels

For internationalization or custom field naming, you can provide a third parameter for custom labels:

```typescript
const formConfig = {
  name: ['', YUP.string().required(), 'Full Name'],
  email: ['', YUP.string().email().required(), 'Email Address'],
  age: [0, YUP.number().min(18).required(), 'Age'],
} as const

const { form, errors, validate, reset, getFieldLabel, fieldLabels } = useYupForm(formConfig)

// Retrieve field labels
console.log(getFieldLabel('name')) // 'Full Name'
console.log(fieldLabels.email) // 'Email Address'
```

## Template Usage

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

**Parameters:**
- `config`: Configuration object with format `{ fieldName: [defaultValue, yupSchema, optionalLabel] }`

**Returns:**
- `form` - Reactive object containing form field values
- `errors` - Ref object containing validation error messages
- `validate()` - Function to validate the form (returns Promise<boolean>)
- `reset()` - Function to reset form to initial values
- `getFieldLabel(fieldKey)` - Function to retrieve field labels
- `fieldLabels` - Object mapping of all field labels

### Exported Utilities

- `YUP` - Yup library instance
- `YUP_OBJECT` - Shorthand for Yup.object()
- `version` - Plugin version
- `pluginInfo` - Plugin information

## Complete Example

The following example demonstrates a comprehensive registration form implementation:

```vue
<template>
  <div class="form-container">
    <h2>Registration Form</h2>
    <form @submit.prevent="handleSubmit">
      <div class="field">
        <label>{{ getFieldLabel('name') }}:</label>
        <input
          v-model="form.name"
          type="text"
          :class="{ error: errors.name }"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="field">
        <label>{{ getFieldLabel('email') }}:</label>
        <input
          v-model="form.email"
          type="email"
          :class="{ error: errors.email }"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="field">
        <label>{{ getFieldLabel('age') }}:</label>
        <input
          v-model.number="form.age"
          type="number"
          :class="{ error: errors.age }"
        />
        <span v-if="errors.age" class="error-message">{{ errors.age }}</span>
      </div>

      <div class="buttons">
        <button type="submit">Submit</button>
        <button type="button" @click="reset">Reset</button>
      </div>
    </form>

    <!-- Debug information (optional) -->
    <div class="debug">
      <h3>Form Data:</h3>
      <pre>{{ JSON.stringify(form, null, 2) }}</pre>

      <h3>Validation Errors:</h3>
      <pre>{{ JSON.stringify(errors, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useYupForm, YUP } from 'vue-yup-wrapper-reactive'

const formConfig = {
  name: ['', YUP.string().required('Name is required').min(2, 'Name must be at least 2 characters'), 'Full Name'],
  email: ['', YUP.string().email('Invalid email format').required('Email is required'), 'Email Address'],
  age: [0, YUP.number().min(18, 'Must be at least 18 years old').max(100, 'Age must be realistic').required('Age is required'), 'Age'],
} as const

const { form, errors, validate, reset, getFieldLabel } = useYupForm(formConfig)

const handleSubmit = async () => {
  const isValid = await validate()
  if (isValid) {
    alert('Form submitted successfully!')
    console.log('Form data:', form)
  } else {
    alert('Please check the form for errors')
  }
}
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.field {
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

input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.buttons {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #3498db;
  color: white;
}

button[type="button"] {
  background-color: #95a5a6;
  color: white;
}

.debug {
  margin-top: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

pre {
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
```

## Requirements

- Vue 3.x
- Yup 1.x
- TypeScript (recommended)

## License

MIT License - free to use, modify, and distribute.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Make your changes
5. Run tests: `npm test`
6. Submit a Pull Request

## Issues and Feature Requests

If you encounter any bugs or have feature requests, please create an issue on GitHub. All feedback and suggestions are appreciated.

## Support

If you find this plugin useful, please consider giving it a star on GitHub. Your support helps maintain and improve the project.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed information about changes in each version.