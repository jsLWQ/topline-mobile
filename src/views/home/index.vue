<template>
  <div>
    <van-nav-bar
      title="首页"
      fixed
    />
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="item in arrChannel" :key="item.id" :title="item.name">
          <van-pull-refresh :success-text="item.ChannelText" v-model="item.pullIsloading" @refresh="onRefresh">
          <div class="box">
            <van-icon name="bars" @click="show = !show"/>
          </div>
            <van-list
              v-model="item.upLoading"
              :finished="item.finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell
                v-for="arrArticleitem in item.arrArticle"
                :key="arrArticleitem.art_id"
                :title="arrArticleitem.title"
              />
            </van-list>
          </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <homePopup v-model="show" @info="infoChannel" :active="active" :arrChannel="arrChannel"></homePopup>
  </div>
</template>
<script>
import { gainChannels } from '@/api/channel'
import { gainArticle } from '@/api/article'
import homePopup from './home-popup/home-popup.vue'
export default {
  name: 'HomeChannel',
  components: {
    homePopup
  },
  data () {
    return {
      active: 0,
      list: [],
      show: true,
      arrChannel: [], // 频道列表
      nameChannel: ''
    }
  },
  watch: {
    async '$store.state.user' () {
      this.gainChannel()
      this.gainChannelID.upLoading = true
    },
    async 'nameChannel' () {

    }
  },
  computed: {
    // 获取当前选中的频道id
    gainChannelID () {
      return this.arrChannel[this.active]
    }
  },
  created () {
    this.gainChannel()
  },
  updated () {
    this.gainName()
  },
  methods: {
    async onLoad () {
      // this.gainChannelID.upLoading = true
      await this.$ss(800)
      let data = []
      data = await this.gainArticleList()
      // console.log(data)
      if (!data.pre_timestamp && !data.results.length) {
        this.gainChannelID.finished = true
        this.gainChannelID.upLoading = false
        return
      }
      // // data.pre_timestamp，data.results.length用Date.now()拿到了历史时间戳，
      if (data.pre_timestamp && !data.results.length) {
        this.gainChannelID.timestamp = data.pre_timestamp
        data = await this.gainArticleList()
        // console.log(data)
        // this.gainChannelID.arrArticle = data.results
      }
      this.gainChannelID.timestamp = data.pre_timestamp
      this.gainChannelID.arrArticle.push(...data.results)
      this.gainChannelID.upLoading = false
      return data.pre_timestamp
    },
    async onRefresh () {
      // console.log(2)
      // 把时间戳备份一个
      const template = this.gainChannelID.template
      this.gainChannelID.timestamp = Date.now()
      const data = await this.gainArticleList()
      // 如果有最新的数据，则将新的数据覆盖到旧的数组
      if (data.results.length) {
        this.gainChannelID.arrArticle = data.results
        // 将这次请求的时间戳给this.gainChannelID.timestamp，用来请求下一次
        this.gainChannelID.timestamp = data.pre_timestamp
        // 成功之后的文本提示
        this.gainChannelID.ChannelText = '更新成功'
        this.gainChannelID.pullIsloading = false
        this.onLoad()
      } else {
        this.gainChannelID.pullIsloading = false
        // 如果没有最新数据则用就的时间戳去发送请求
        this.gainChannelID.timestamp = template
        this.gainChannelID.ChannelText = '已是最新数据'
      }
    },
    // 获取频道
    async gainChannel () {
      // console.log(this.$store.state.user)
      // 判断是否登录
      let arrChannel = []
      if (this.$store.state.user) {
        const data = await gainChannels()
        // console.log(data)
        arrChannel = data.channels
      } else {
        let localChannel = JSON.parse(window.localStorage.getItem('localChannel'))
        if (localChannel) {
          arrChannel = localChannel
        } else {
          const datas = await gainChannels()
          // console.log(datas)
          arrChannel = datas.channels
        }
      }
      arrChannel.forEach(item => {
        // item.seq = this.active+1
        item.arrArticle = []
        item.pullIsloading = false // 下拉
        item.upLoading = false // 上拉
        item.timestamp = Date.now()
        item.finished = false
      })
      this.arrChannel = arrChannel
    },
    // 获取新闻
    async gainArticleList () {
      try {
        const data = await gainArticle({
          channelId: this.gainChannelID.id,
          timestamp: this.gainChannelID.timestamp,
          withTop: 1
        })
        return data
      } catch (error) {
        console.log(error)
      }
    },
    // 子组件-点击进入该频道
    infoChannel (index) {
      this.active = index
      this.show = false
    },
    gainName () {
      // console.log(1111)
      // console.log(this.gainChannelID.id)
      this.nameChannel = this.gainChannelID.name
    }
  }
}
</script>
<style lang='less' scoped>
.van-tabs {
  margin-bottom: 100px;
}
.van-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 92px;
}
.van-list {
  margin-top: 86px;
}
.van-icon {
  z-index: 1111;
  font-size: 52px;
}
.box {
  // width: 60px;
  height: 84px;
  display: flex;
  position: absolute;
  right: 0;
  top: -82px;
  background: #fff;
  z-index: 111;;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
}
</style>
