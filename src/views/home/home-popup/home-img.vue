<template>
  <van-grid :border="false" :column-num="3">
    <van-grid-item :value="value" v-for="(item,index) in value.images" :key="index">
      <van-image :src="item" lazy-load/>
    </van-grid-item>
  </van-grid>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  props: {
    value: {
      type: Object
    }
  },
  created () {
    // console.log(this.value)
  }
}
</script>
<style lang='less' scoped>

</style>
