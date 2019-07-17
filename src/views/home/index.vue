<template>
  <div>
    <!-- <van-nav-bar
      title="首页"
      fixed
    /> -->
      <div slot="header" class="home_box">
        <van-search
          placeholder="请输入搜索关键词"
          shape="round"
          @focus="$router.push({name: 'search'})"
        >
        </van-search>
      </div>
    <!-- </van-nav-bar> -->
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
                v-for="(arrArticleitem,index) in item.arrArticle"
                :key="arrArticleitem.art_id + ''"
                :title="arrArticleitem.title"
              >
                <div slot="label">
                  <template v-if="arrArticleitem.cover.type">
                    <!-- 子组件，显示图片 -->
                    <homeImage v-model="item.arrArticle[index].cover"></homeImage>
                  </template>
                  <p>
                  <span>{{arrArticleitem.aut_name}}</span>
                  &nbsp;
                  <span>{{arrArticleitem.comm_count}}评论</span>
                  &nbsp;
                  <span>{{arrArticleitem.pubdate | formattingTime}}</span>
                  <!-- 左侧更多操作按钮 -->
                  <van-icon v-if="$store.state.user" name="close" class="right_icon" @click="dislikeArticle(arrArticleitem)"/>
                </p>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- 子组件频道管理 -->
    <homePopup v-model="show" @info="infoChannel" :active="active" :arrChannel="arrChannel"></homePopup>
    <!-- 子组件更多操作 -->
    <homeHandle v-model="ishomeHandleShow" @blockUser="blockUser" :clickArticle="clickArticle" @loseInterestIn="loseInterestIn"></homeHandle>
  </div>
</template>
<script>
import { gainChannels } from '@/api/channel'
import { blackLists } from '@/api/user'
import { gainArticle, dislikesArticle } from '@/api/article'
import homePopup from './home-popup/home-popup.vue' // 频道编辑组件
import homeImage from './home-popup/home-img' // 显示图片组件
import homeHandle from './home-popup/home-handle' // 子组件更多操作

export default {
  name: 'HomeChannel',
  components: {
    homePopup,
    homeImage,
    homeHandle
  },
  data () {
    return {
      active: 0,
      list: [],
      show: false,
      arrChannel: [], // 频道列表
      nameChannel: '',
      ishomeHandleShow: false, // 控制更多操作是否显示
      clickArticle: null // 当前点击的这个新闻
    }
  },
  watch: {
    async '$store.state.user' () {
      this.gainChannel()
      this.gainChannelID.upLoading = true
    },
    async 'nameChannel' () {
      this.$forceUpdate()
      this.$nextTick(() => {
        this.gainChannelID.arrArticle.slice(0)
      })
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
    // 上拉加载更多
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
      // console.log(this.gainChannelID.arrArticle[0].cover)
      return data.pre_timestamp
    },
    // 下拉刷新
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
    },
    // 当前点击的新闻
    dislikeArticle (item) {
      // console.log(item)
      this.ishomeHandleShow = true
      this.clickArticle = item
    },
    // 响应子组件事件-不感兴趣
    async loseInterestIn () {
      // 筛选出和点击新闻id相同的元素，取出其索引值
      const index = this.gainChannelID.arrArticle.findIndex(item => item === this.clickArticle)
      console.log(index)
      try {
        // console.log(this.clickArticle.art_id)
        await dislikesArticle(this.clickArticle.art_id + '')
        // console.log(data)
        this.$toast({
          message: '将减少推荐类似内容',
          icon: 'success'
        })
        this.gainChannelID.arrArticle.splice(index, 1)
      } catch (error) {
        console.log(error)
      }
    },
    // 响应子组件事件-拉黑用户
    async blockUser () {
      const index = this.gainChannelID.arrArticle.findIndex(item => item === this.clickArticle)
      // console.log(index)
      try {
        await blackLists(this.clickArticle.aut_id)
        this.gainChannelID.arrArticle.splice(index, 1)
        // console.log(data)
        this.$toast.success('已屏蔽该用户')
      } catch (error) {
        console.log(error)
        this.$toast.fail('操作失败')
      }
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
  top: 100px;
  background: #fff;
  z-index: 111;;
  justify-content: flex-end;
  align-items: center;
  position: fixed;
}
.van-list /deep/ .van-cell {
  // position: absolute;
  flex-wrap: nowrap;
}
.van-tabs /deep/ .van-hairline--top-bottom {
  margin-right: 26px;
}
.right_icon {
  float: right;
  z-index: 0;
}
.home_box {
  width: 375*2px;
  line-height: 46*2px;
  height: 46*2px;
  display: flex;
  background: rgb(50, 150, 250);
  justify-content: center;
  position: fixed;
  z-index: 888;
}
.home_box /deep/ .van-search {
  background: rgb(50, 150, 250)!important;
}
</style>
