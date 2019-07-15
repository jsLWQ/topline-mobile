<template>
  <div>
    <van-dialog
      :value="value"
      @input="$emit('input', $event)"
      :showConfirmButton="false"
      closeOnClickOverlay
    >
      <van-cell-group v-if="!isInform">
        <van-cell title="对此内容不感兴趣" @click="dissArticle" class="iconfont icon-buganxingqu icon_font"/>
        <van-cell title="举报" @click="isInform = true" is-link class="iconfont icon-jubao icon_font"/>
        <van-cell title="拉黑作者" @click="blockUser" class="iconfont icon-lahei icon_font"/>
      </van-cell-group>
      <van-cell-group v-else>
        <van-cell is-link arrow-direction="left" @click="isInform = false"/>
        <van-cell v-for="item in arrState" :key="item.value" :value="item.label" @click="IsInform(item)"/>
      </van-cell-group>
    </van-dialog>
  </div>
</template>
<script>
import { reportsArticle } from '@/api/article.js'
export default {
  data () {
    return {
      arrState: [
        { label: '标题夸张', value: '1' },
        { label: '低俗色情', value: '2' },
        { label: '错别字多', value: '3' },
        { label: '旧闻重复', value: '4' },
        { label: '广告软文', value: '5' },
        { label: '内容不实', value: '6' },
        { label: '涉嫌违法犯罪', value: '7' },
        { label: '侵权', value: '8' },
        { label: '其他问题', value: '0' }
      ],
      isInform: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    clickArticle: {
      type: Object
    }
  },
  methods: {
    // 不感兴趣
    dissArticle () {
      this.$emit('input', false)
      this.$emit('loseInterestIn')
    },
    // 举报
    async IsInform (item) {
      console.log(item.value)
      console.log(this.clickArticle.art_id + '')
      try {
        let obj = {
          target: this.clickArticle.art_id + '',
          type: item.value
        }
        console.log(obj)

        await reportsArticle({ target: this.clickArticle.art_id + '', type: item.value })
      } catch (error) {
        console.log(error)
      }
    },
    // 拉黑用户
    async blockUser () {
      this.$emit('input', false)
      this.$emit('blockUser')
    }
  }
}
</script>
<style lang='less' scoped>
.icon_font {
  font-size:36px;
  font-weight:700
}
</style>
