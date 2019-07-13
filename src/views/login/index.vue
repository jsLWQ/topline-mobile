<template>
  <div>
    <van-nav-bar
      title="标题"
    />
    <form>
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          v-validate="'required'"
          name="mobile"
          required
          clearable
          label="手机号"
          placeholder="请输入手机号"
          :error-message="errors.first('mobile')"
        />
        <van-field
          v-model="user.code"
          v-validate="'required'"
          name="code"
          type="password"
          label="验证码"
          placeholder="请输入验证码"
          required
          :error-message="errors.first('code')"
        />
        <div class="login-btn">
          <van-button :loading="loginLoading" loading-text="加载中..." type="info" @click.prevent="Clogin">登录</van-button>
        </div>
      </van-cell-group>
    </form>
  </div>
</template>
<script>
import { userLogin } from '@/api/user.js'
export default {
  data () {
    return {
      user: {
        mobile: '17686506616',
        code: '246810'
      },
      loginLoading: false
    }
  },
  created () {
    this.customHint()
  },
  methods: {
    async Clogin () {
      this.loginLoading = true
      try {
        const valid = await this.$validator.validate()
        if (!valid) {
          this.loginLoading = false
          return
        }
        const data = await userLogin(this.user)
        this.$store.commit('setUsers', data)
        this.$toast.success('登录成功')
        this.$router.push('/')
        // console.log(datas)
      } catch (error) {
        console.log(error)
      }
      this.loginLoading = false
    },
    // 自定义提示
    customHint () {
      const dict = {
        custom: {
          mobile: {
            required: '请输入手机号'
          },
          code: {
            required: () => '请输入验证码'
          }
        }
      }
      this.$validator.localize('zh_CN', dict)
    }
  }
}
</script>
<style lang='less' scoped>
.login-btn {
  padding: 20px;
  .van-button {
    width: 100%;
  }
}
.van-button {
  background: rgb(109, 180, 251)
}
</style>
