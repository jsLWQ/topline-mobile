<template>
  <div>
   <van-nav-bar
    title="搜索结果"
    left-text="返回"
    left-arrow
    fixed
    @click-left="$router.back()"
  />
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <van-cell
      v-for="(item,index) in arrResult"
      :key="index"
      :title="item.title"
    >
    <div slot="label">
      <template v-if="item.cover.images.length">
        <van-grid :border="false" :column-num="3">
          <van-grid-item v-for="items in item.cover.images" :key="items">
            <van-image lazy-load :src="items" />
          </van-grid-item>
        </van-grid>
      </template>
    </div>
    </van-cell>
  </van-list>
  </div>
</template>
<script>
import { searchResult } from '@/api/search-result'
export default {
  name: 'searchRes',
  data () {
    return {
      list: [],
      loading: false, // 加载的loading
      finished: false, // 拉到底部，没有数据时
      page: 1,
      per_page: 20,
      arrResult: []
    }
  },
  computed: {
    q () {
      return this.$route.params.q
    }
  },
  created () {
    // console.log(this.$route.params)
  },
  deactivated () {
    this.$destroy()
  },
  methods: {
    async onLoad () {
      await this.$ss(500)
      // 获取搜索结果
      try {
        const data = await searchResult({
          page: this.page,
          per_page: this.per_page,
          q: this.$route.params.q
        })
        // console.log(data)
        if (!data.results.length) {
          this.loading = false
          this.finished = false
          return
        }
        this.arrResult.push(...data.results)
        this.page += 1
        this.loading = false
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang='less' scoped>
.van-nav-bar__left /deep/ .van-icon {
  color: #fff
}
.van-nav-bar__left /deep/ .van-nav-bar__text {
  color: #fff
}
.van-list {
  margin-top: 46*2px;
}
</style>
