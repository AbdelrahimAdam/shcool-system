import { ref, reactive } from 'vue'

export function useForm(initialState, submitHandler) {
  const form = reactive({ ...initialState })
  const errors = ref({})
  const isSubmitting = ref(false)

  const reset = () => {
    Object.assign(form, initialState)
    errors.value = {}
  }

  const submit = async () => {
    isSubmitting.value = true
    errors.value = {}
    try {
      await submitHandler(form)
      reset()
    } catch (err) {
      if (err.errors) {
        errors.value = err.errors
      }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    form,
    errors,
    isSubmitting,
    reset,
    submit
  }
}