import { reactive, ref } from "vue";
import * as Yup from "yup";

export const YUP = Yup;
export const YUP_OBJECT = Yup.object;

type FormValue = unknown;
type FormField<T extends FormValue> = [T, Yup.Schema<T>, string?];
type FormConfig = Record<string, FormField<FormValue>>;

export function useYupForm<T extends FormConfig>(config: T) {
  const initialValues = Object.entries(config).reduce((acc, [key, [value]]) => {
    acc[key as keyof typeof acc] = value;
    return acc;
  }, {} as { [K in keyof T]: T[K][0] });

  const schema = YUP_OBJECT().shape(
    Object.entries(config).reduce((acc, [key, [_, validator, label]]) => {
      // Clone validator and set custom label for error messages
      const customValidator = validator.clone();

      // If label exists, use it for error messages
      if (label) {
        // Override error messages to use label
        customValidator.label(label);
      }

      acc[key as keyof typeof acc] = customValidator;
      return acc;
    }, {} as { [K in keyof T]: T[K][1] })
  );

  // Add function to get field labels/names
  const getFieldLabel = (fieldKey: keyof T): string => {
    const fieldConfig = config[fieldKey];
    return fieldConfig[2] || String(fieldKey); // Use rename if available, or original field key
  };

  // Add object for mapping field labels
  const fieldLabels = Object.entries(config).reduce(
    (acc, [key, [_, __, label]]) => {
      acc[key as keyof typeof acc] = label || key;
      return acc;
    },
    {} as { [K in keyof T]: string }
  );

  const form = reactive({ ...initialValues });
  const errors = ref<Partial<Record<keyof T, string>> | Record<string, never>>(
    {}
  );

  async function validate(): Promise<boolean> {
    try {
      await schema.validate(form, { abortEarly: false });
      errors.value = {}; // clear all errors
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError && Array.isArray(err.inner)) {
        const newErrors = {};
        err.inner.forEach((error) => {
          if (error.path) {
            // Get the renamed field label
            const fieldLabel = getFieldLabel(error.path as keyof T);
            // Replace field name in error message with the renamed label
            const customMessage = error.message.replace(
              new RegExp(`\\b${error.path}\\b`, "gi"),
              fieldLabel
            );
            Object.assign(newErrors, { [error.path]: customMessage });
          }
        });

        errors.value = newErrors;
      } else {
        // Handle unexpected errors
        console.error("Validation error:", err);
        // state.errors = { _form: 'An unexpected error occurred' } as Partial<Record<keyof T, string>>;
      }
      return false;
    }
  }

  const reset = () => {
    Object.assign(form, initialValues);
    errors.value = {};
  };

  return {
    form,
    errors,
    reset,
    validate,
    getFieldLabel, // Export function to get field label
    fieldLabels, // Export object mapping field labels
  };
}
