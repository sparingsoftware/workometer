<template>
  <div class="view">
    <div class="wrapper">
      <h1 class="header">work'o'meter</h1>
      <h2 class="subheader">
        To log in you need a token
        <a type="primary" href="#" @click="openInBrowser">
          Click here
        </a> to obtain one
      </h2>
      <el-form ref="form" :model="form" @submit.native.prevent>
        <el-form-item prop="username" label="Email or username" :rules="rules.username">
          <el-input v-model="form.username" @keyup.enter.native.prevent="submitForm('form')"/>
        </el-form-item>
        <el-form-item prop="password" label="Token" :rules="rules.password">
          <el-input v-model="form.password" type="password" @keyup.enter.native.prevent="submitForm('form')"/>
        </el-form-item>
        <el-form-item class="centered-content">
          <el-button type="primary" :loading="isFormSending" @click.native="submitForm('form')">
            Login
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import open from 'open'

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
    openInBrowser () {
      open('https://id.atlassian.com/manage/api-tokens')
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return
        this.isFormSending = true
        this.$store.dispatch('login', this.form).then(() => {
          this.$router.push({ name: 'dashboard' })
        }).catch(this.handleErrors).finally(() => {
          this.isFormSending = false
        })
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

.header {
  font-size: 36px;
  text-align: center;
}

.subheader {
  font-size: 18px;
  text-align: justify;
}
</style>
