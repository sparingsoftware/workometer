export default {
  methods: {
    handleErrors (errors) {
      console.log(errors, 'errs')
      let formattedErrors = ''
      const parsedErrors = errors.response.data
      formattedErrors += parsedErrors.errorMessages.join('<br>')
      if (formattedErrors) {
        formattedErrors += '<br>'
      }
      Object.keys(parsedErrors.errors).forEach(field => {
        formattedErrors += `${field}: ${parsedErrors.errors[field]}<br>`
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
