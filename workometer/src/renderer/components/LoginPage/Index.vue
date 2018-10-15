<template>
  <div class="wrapper">
    <el-form :model="form" ref="form" @submit.native.prevent="submitForm('form')">
      <el-form-item
        prop="username"
        label="Username"
        :rules="rules.username"
      >
        <el-input v-model="form.username"/>
      </el-form-item>
      <el-form-item
        prop="password"
        label="Password"
        :rules="rules.password"
      >
        <el-input v-model="form.password" type="password"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">Login</el-button>
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
            {required: true, message: 'Please input username', trigger: 'blur'}
          ],
          password: [
            {required: true, message: 'Please input password', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
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
</style>