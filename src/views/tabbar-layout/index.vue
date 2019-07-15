<template>
  <div>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <van-tabbar v-model="active">
      <van-tabbar-item name="home" icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item name="search" icon="chat">问答</van-tabbar-item>
      <van-tabbar-item name="friends" icon="video">视频</van-tabbar-item>
      <van-tabbar-item name="setting" icon="manager">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  data () {
    return {
      active: 'home'
    }
  }
}
</script>
<style lang='less' scoped>
</style>
