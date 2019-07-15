<template>
  <div>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>
<script>
export default {
  name: 'AppVue'
}
</script>
<style lang='less' scoped>
.box {
  margin-top: 20px;
  width: 375px;
  height: 200px;
  background: blue;
}
</style>
