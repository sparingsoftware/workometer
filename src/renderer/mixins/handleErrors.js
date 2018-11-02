export default {
  methods: {
    handleErrors (errors) {
      let formattedErrors = ''
      const parsedErrors = JSON.parse(errors)
      formattedErrors += parsedErrors.body.errorMessages.join('\n')
      Object.keys(parsedErrors.body.errors).forEach(field => {
        formattedErrors += `${field}: ${parsedErrors.body.errors[field]}`
      })
      this.$notify({
        title: 'Error',
        message: formattedErrors,
        type: 'error'
      })
    }
  }
}
