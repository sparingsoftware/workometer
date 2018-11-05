export default {
  methods: {
    handleErrors (errors) {
      const parsedErrors = errors.response.data.errorMessages
      this.$notify({
        title: 'Error',
        message: parsedErrors.join(),
        type: 'error'
      })
    }
  }
}
