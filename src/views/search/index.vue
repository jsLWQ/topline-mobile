<template>
  <div>
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      @search="onSearch"
    >
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
    <!-- 联想建议 -->
      <van-cell v-for="(item,index) in arrSuggeStion" :key="index" :title="item" icon="search" />
    <!-- /联想建议 -->
  </div>
</template>
<script>
import { suggeStion } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'homeSearch',
  data () {
    return {
      value: '',
      arrSuggeStion: [] // 存放联想建议
    }
  },
  watch: {
    value: debounce(async function () {
      this.value.trim()
      console.log(this.value.length)
      if (this.value.length === 0) {
        this.arrSuggeStion = []
        return
      }
      try {
        const data = await suggeStion(this.value)
        console.log(data)
        this.arrSuggeStion = data.options
      } catch (error) {
        console.log(error)
      }
    }, 500)
  },
  methods: {
    onSearch () {
      console.log(1)
    }
  }
}
</script>
<style lang='less' scoped>

</style>
