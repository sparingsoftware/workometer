<template>
  <div class="wrapper">
    <el-form :model="form" ref="form" @submit.native.prevent>
      <el-form-item
        prop="username"
        label="Username"
        :rules="rules.username"
      >
        <el-input v-model="form.username" @keyup.enter.native.prevent="submitForm('form')"/>
      </el-form-item>
      <el-form-item
        prop="password"
        label="Password"
        :rules="rules.password"
      >
        <el-input v-model="form.password" type="password" @keyup.enter.native.prevent="submitForm('form')"/>
      </el-form-item>
      <el-form-item class="centered-content">
        <el-button type="primary" @click="submitForm('form')" :loading="isFormSending">Login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: 'Please input username', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please input password', trigger: 'blur' }
        ]
      },
      isFormSending: false
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // Enable loading animation
          this.isFormSending = true
          // Dispatching event to the store
          this.$store.dispatch('login', this.form).then(() => {
            // Disabling loading animation
            this.isFormSending = false
            // Redirecting to the dashboard
            this.$router.push({ name: 'dashboard' })
          }).catch(err => {
            // Handling errors
            this.handleErrors(err)
            // Disabling loading animation
            this.isFormSending = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .wrapper {
    max-width: 350px;
    margin: 0 auto;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }

  .centered-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
