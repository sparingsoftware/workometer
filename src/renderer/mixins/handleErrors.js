export default {
  methods: {
    handleErrors (errors) {
      let formattedErrors = ''
      const parsedErrors = JSON.parse(errors)
      formattedErrors += parsedErrors.body.errorMessages.join('<br>')
      if (formattedErrors) {
        formattedErrors += '<br>'
      }
      Object.keys(parsedErrors.body.errors).forEach(field => {
        formattedErrors += `${field}: ${parsedErrors.body.errors[field]}<br>`
      })
      this.$notify({
        title: 'Error',
        message: formattedErrors,
        dangerouslyUseHTMLString: true,
        type: 'error'
      })
    }
  }
}
