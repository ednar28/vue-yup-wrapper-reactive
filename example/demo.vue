<template>
  <div class="demo-container">
    <h1>Vue Yup Wrapper Reactive - Demo</h1>
    
    <div class="form-section">
      <h2>Registration Form Example</h2>
      <form @submit.prevent="handleSubmit" class="demo-form">
        <div class="form-group">
          <label>{{ getFieldLabel('firstName') }}:</label>
          <input 
            v-model="form.firstName" 
            type="text" 
            :class="{ 'error-input': errors.firstName }"
            placeholder="Masukkan nama depan"
          />
          <span v-if="errors.firstName" class="error">{{ errors.firstName }}</span>
        </div>

        <div class="form-group">
          <label>{{ getFieldLabel('lastName') }}:</label>
          <input 
            v-model="form.lastName" 
            type="text" 
            :class="{ 'error-input': errors.lastName }"
            placeholder="Masukkan nama belakang"
          />
          <span v-if="errors.lastName" class="error">{{ errors.lastName }}</span>
        </div>

        <div class="form-group">
          <label>{{ getFieldLabel('email') }}:</label>
          <input 
            v-model="form.email" 
            type="email" 
            :class="{ 'error-input': errors.email }"
            placeholder="contoh@email.com"
          />
          <span v-if="errors.email" class="error">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label>{{ getFieldLabel('age') }}:</label>
          <input 
            v-model.number="form.age" 
            type="number" 
            :class="{ 'error-input': errors.age }"
            placeholder="Masukkan umur"
          />
          <span v-if="errors.age" class="error">{{ errors.age }}</span>
        </div>

        <div class="form-group">
          <label>{{ getFieldLabel('password') }}:</label>
          <input 
            v-model="form.password" 
            type="password" 
            :class="{ 'error-input': errors.password }"
            placeholder="Minimal 6 karakter"
          />
          <span v-if="errors.password" class="error">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label>{{ getFieldLabel('confirmPassword') }}:</label>
          <input 
            v-model="form.confirmPassword" 
            type="password" 
            :class="{ 'error-input': errors.confirmPassword }"
            placeholder="Konfirmasi password"
          />
          <span v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</span>
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input 
              v-model="form.terms" 
              type="checkbox" 
              :class="{ 'error-input': errors.terms }"
            />
            <span>{{ getFieldLabel('terms') }}</span>
          </label>
          <span v-if="errors.terms" class="error">{{ errors.terms }}</span>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Submit</button>
          <button type="button" @click="reset" class="btn btn-secondary">Reset</button>
          <button type="button" @click="validateForm" class="btn btn-info">Validate Only</button>
        </div>
      </form>
    </div>

    <div class="debug-section">
      <h3>Debug Information</h3>
      <div class="debug-content">
        <div class="debug-item">
          <h4>Form Values:</h4>
          <pre>{{ JSON.stringify(form, null, 2) }}</pre>
        </div>
        <div class="debug-item">
          <h4>Validation Errors:</h4>
          <pre>{{ JSON.stringify(errors, null, 2) }}</pre>
        </div>
        <div class="debug-item">
          <h4>Field Labels:</h4>
          <pre>{{ JSON.stringify(fieldLabels, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useYupForm, YUP } from '../src/index'

// Konfigurasi form dengan custom labels dalam bahasa Indonesia
const formConfig = {
  firstName: ['', YUP.string().required('Nama depan wajib diisi'), 'Nama Depan'],
  lastName: ['', YUP.string().required('Nama belakang wajib diisi'), 'Nama Belakang'],
  email: ['', YUP.string().email('Format email tidak valid').required('Email wajib diisi'), 'Alamat Email'],
  age: [0, YUP.number().min(18, 'Umur minimal 18 tahun').required('Umur wajib diisi'), 'Umur'],
  password: ['', YUP.string().min(6, 'Password minimal 6 karakter').required('Password wajib diisi'), 'Password'],
  confirmPassword: ['', YUP.string().oneOf([YUP.ref('password')], 'Password tidak cocok').required('Konfirmasi password wajib diisi'), 'Konfirmasi Password'],
  terms: [false, YUP.boolean().oneOf([true], 'Anda harus menyetujui syarat dan ketentuan'), 'Saya menyetujui syarat dan ketentuan']
} as const

// Inisialisasi form dengan useYupForm
const { form, errors, validate, reset, getFieldLabel, fieldLabels } = useYupForm(formConfig)

// Handler untuk submit form
const handleSubmit = async () => {
  const isValid = await validate()
  if (isValid) {
    alert('Form berhasil disubmit! ✅\n\nData:\n' + JSON.stringify(form, null, 2))
    console.log('Form data:', form)
  } else {
    alert('Form masih memiliki error! ❌\n\nSilakan perbaiki error yang ada.')
    console.log('Validation errors:', errors.value)
  }
}

// Handler untuk validasi saja tanpa submit
const validateForm = async () => {
  const isValid = await validate()
  if (isValid) {
    alert('Form valid! ✅')
  } else {
    alert('Form memiliki error! ❌\n\nCek console untuk detail error.')
    console.log('Validation errors:', errors.value)
  }
}
</script>

<style scoped>
.demo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

h2 {
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.form-section {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.demo-form {
  display: grid;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.checkbox-group {
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
}

input[type="text"],
input[type="email"],
input[type="number"],
input[type="password"] {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="number"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.error-input {
  border-color: #e74c3c !important;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
}

.error {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
  transform: translateY(-2px);
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
  transform: translateY(-2px);
}

.debug-section {
  background: #2c3e50;
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-top: 30px;
}

.debug-section h3 {
  color: #ecf0f1;
  margin-bottom: 20px;
}

.debug-content {
  display: grid;
  gap: 20px;
}

.debug-item h4 {
  color: #3498db;
  margin-bottom: 10px;
}

.debug-item pre {
  background: #34495e;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 14px;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .demo-container {
    padding: 15px;
  }
  
  .form-section {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>