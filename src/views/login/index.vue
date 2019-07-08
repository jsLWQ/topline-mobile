<template>
  <div>
    <van-nav-bar
      title="标题"
    />
    <form>
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          required
          clearable
          label="手机号"
          placeholder="请输入手机号"
        />
        <van-field
          v-model="user.code"
          type="password"
          label="验证码"
          placeholder="请输入验证码"
          required
        />
        <div class="login-btn">
          <van-button type="info" @click.prevent="Clogin">登录</van-button>
        </div>
      </van-cell-group>
    </form>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      user: {
        mobile: '17686506616',
        code: '123456'
      }
    }
  },
  methods: {
    async Clogin () {
      try {
        const datas = await axios({
          method: 'POST',
          url: `http://toutiao.course.itcast.cn/app/v1_0/authorizations`,
          data: this.user
        })
        this.$toast.success('登录成功')
        this.$router.push('/')
        console.log(datas)
      } catch (error) {
        console.log(error)
      }
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
