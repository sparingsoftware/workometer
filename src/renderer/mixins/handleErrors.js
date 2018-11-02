export default {
  methods: {
    handleErrors (errors) {
      console.log(errors, 'errors')
      const parsedErrors = JSON.parse(errors).body.errorMessages
      this.$notify({
        title: 'Error',
        message: parsedErrors.join(),
        type: 'error'
      })
    }
  }
}
