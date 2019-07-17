<template>
  <div>
    <van-icon name="arrow-left" class="icon_s" @click="$router.back()" />
    <form action="/">
      <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        @input="importInput"
        show-action
        shape="round"
        @search="onSearch(value)"
      >
        <div slot="action" @click="onSearch(value)">搜索</div>
      </van-search>
    </form>
    <!-- 联想建议 -->
    <template v-if="arrSuggeStion.length">
      <van-cell v-for="(item,index) in arrSuggeStion" :key="index" icon="search" @click="onSearch(item)">
        <div slot="title" v-html="clolorChange(item, value)">
        </div>
      </van-cell>
    </template>
    <!-- /联想建议 -->
    <!-- 历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <van-icon
        v-if="!isDelete"
          slot="right-icon"
          name="delete"
          style="line-height: inherit;"
          @click="isIS"
        />
        <div style="display:inline" v-if="isDelete">
          <span>全部删除</span>
          &nbsp;
          <span @click="isComplete">完成</span>
        </div>
      </van-cell>
      <van-cell v-for="(item,index) in arrResult" :key="item" :title="item" @click="onSearch(item)" class="iconfont icon-lishijilu">
        <van-icon
          v-if="isDelete"
          slot="right-icon"
          name="cross"
          style="line-height: inherit;"
          @click="singleDele(index)"
        />
      </van-cell>
    </van-cell-group>
    <!-- /历史记录 -->
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
      arrSuggeStion: [], // 存放联想建议
      isDelete: false, // 判断是否显示删除图标
      arrResult: JSON.parse(window.localStorage.getItem('Result')) || [], // 用来放置历史记录
      isSkip: true // 控制删除和搜索的
    }
  },
  watch: {
    // 监视输入的内容，利用防抖发送请求
    value: debounce(async function () {
      this.value.trim()
      // console.log(this.value.length)
      if (this.value.length === 0) {
        this.arrSuggeStion = []
        return
      }
      try {
        const data = await suggeStion(this.value)
        // console.log(data)
        this.arrSuggeStion = data.options
      } catch (error) {
        console.log(error)
      }
    }, 500),
    arrResult () {
      window.localStorage.setItem('Result', JSON.stringify(this.arrResult))
    }
  },
  methods: {
    // 搜索
    onSearch (value) {
      // console.log(value)
      if (this.isSkip) {
        if (value.trim() === '') {
          return
        }
        this.arrResult.unshift(value)
        let arr = new Set(this.arrResult)
        // console.log(Array.from(arr))
        this.arrResult = Array.from(arr)
        this.$router.push({
          name: 'searchResult',
          params: {
            q: value
          }
        })
        this.value = ''
      }
    },
    // 字体颜色高亮
    clolorChange (item, value) {
      // console.log(item, value)
      return item.toLowerCase().split(value).join(`<span style="color:red">${value}</span>`)
    },
    // 单个删除
    singleDele (index) {
      this.arrResult.splice(index, 1)
    },
    // 点击删除按钮
    isIS () {
      this.isSkip = false
      this.isDelete = true
    },
    // 点击完成
    isComplete () {
      this.isDelete = false
      this.isSkip = true
    },
    importInput () {
      this.isDelete = false
      this.isSkip = true
    }
  }
}
</script>
<style lang='less' scoped>
.icon_s {
  float: left;
  margin-left: 10px;
  margin-top: 4%;
}
.van-cell__title {
  margin-left: 10px;
}
</style>
