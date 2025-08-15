<script setup lang="ts">
import { useYupForm, YUP } from "../src/index";

// Form configuration with name and email fields
const formConfig = {
  name: ["", YUP.string().required(), "Name"],
  email: ["", YUP.string().email().required(), "Email"],
} as const;

// Initialize form using vue-yup-wrapper-reactive
const { form, errors, validate, reset } = useYupForm(formConfig);

// Function to submit form
const handleSubmit = async () => {
  const isValid = await validate();
  if (isValid) {
    alert(
      `Form submitted successfully!\nName: ${form.name}\nEmail: ${form.email}`
    );
  } else {
    console.log("Form has errors:", errors.value);
  }
};

// Function to reset form
const handleReset = () => {
  reset();
  console.log("Form has been reset");
};
</script>

<template>
  <div class="form-container">
    <h2>Simple Form Example</h2>
    <p>Form with validation using vue-yup-wrapper-reactive</p>

    <form @submit.prevent="handleSubmit" class="form">
      <!-- Name Field -->
      <div class="field-group">
        <label for="name">Name:</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="Enter your name"
          :class="{ error: errors.name }"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <!-- Email Field -->
      <div class="field-group">
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="Enter your email"
          :class="{ error: errors.email }"
        />
        <span v-if="errors.email" class="error-message">{{
          errors.email
        }}</span>
      </div>

      <!-- Submit and Reset Buttons -->
      <div class="button-group">
        <button type="submit" class="btn btn-primary">Submit</button>
        <button type="button" @click="handleReset" class="btn btn-secondary">
          Reset
        </button>
      </div>
    </form>

    <!-- Form Data Preview -->
    <div class="form-preview">
      <h3>Data Preview:</h3>
      <p><strong>Name:</strong> {{ form.name || "(empty)" }}</p>
      <p><strong>Email:</strong> {{ form.email || "(empty)" }}</p>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

.form-container h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

.form-container p {
  color: #666;
  margin-bottom: 1.5rem;
}

.form {
  margin-bottom: 2rem;
}

.field-group {
  margin-bottom: 1.5rem;
}

.field-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.field-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.field-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.field-group input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
}

.error-message {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.button-group {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.form-preview {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.form-preview h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

.form-preview p {
  margin: 0.5rem 0;
  color: #555;
}
</style>
