<template>
  <div>
    <!-- 弹出层 -->
    <van-popup
      :value="value"
      @input="$emit('input', $event)"
      position="bottom"
      :style="{ height: '95%' }"
    >
    <!-- 我的频道 -->
    <van-panel title="我的频道">
      <van-button class="popup_btn" @click="state = !state" size="mini" round type="danger">{{state?'完成':'编辑'}}</van-button>
      <van-grid :border="false" :gutter="10">
        <van-grid-item
          v-for="(item,index) in arrChannel"
          :key="item.id"
          :text="item.name"
          class="active"
          @click="IsChannels(item,index)"
        >
        <template>
          <div class="popup_div" :class="{actives:index === active && !state}">
            {{item.name}}
            <van-icon v-show="state && item.name !== '推荐'" name="close" />
          </div>
        </template>
        </van-grid-item>
      </van-grid>
    </van-panel>
    <!-- /我的频道 -->
    <!-- 推荐频道 -->
    <van-panel class="recommend" :border="false" title="推荐频道">
      <van-grid :border="false" :gutter="6">
        <van-grid-item
          v-for="(items,index) in filterChannel"
          :key="items.id"
          :text="items.name"
          @click="addChann(items,index)"
        >
        </van-grid-item>
      </van-grid>
    </van-panel>
    <!-- /推荐频道 -->
    </van-popup>
    <!-- /弹出层 -->
  </div>
</template>
<script>
import { gainAllChannels, addChannels, delChannel } from '@/api/channel'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      allChannel: [],
      state: false // 判断是编辑还是非编辑状态
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    arrChannel: {
      type: Array,
      default: () => []
    },
    active: {
      type: Number,
      default: 0
    }
  },
  computed: {
    // 过滤出频道
    filterChannel () {
      let data = this.arrChannel.map(item => item.id)
      return this.allChannel.filter(item => !data.includes(item.id))
    },
    ...mapState(['user'])
  },
  created () {
    this.gainAllChannel()
  },
  methods: {
    // 获取所有频道
    async gainAllChannel () {
      // console.log(1)
      const data = await gainAllChannels()
      data.channels.forEach(item => {
        item.arrArticle = []
        item.pullIsloading = false // 下拉
        item.upLoading = false // 上拉
        item.timestamp = Date.now()
        item.finished = false
      })
      // console.log(data)
      this.allChannel = data.channels
    },
    // 添加频道
    async addChann (item, index) {
      // console.log(item)
      this.arrChannel.push(item)
      if (this.user) {
        const data = this.arrChannel.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })
        console.log(data)
        const datas = await addChannels(data)
        console.log(datas)
      } else {
        window.localStorage.setItem('localChannel', JSON.stringify(this.arrChannel))
      }
    },
    // 用来判断当前是编辑状态还是非编辑状态
    IsChannels (item, index) {
      // 非编辑状态下，点击进入该频道
      if (!this.state) {
        this.intoChannels(item, index)
      } else {
        // 编辑状态下，点击删除该频道
        item.name !== '推荐' && this.delChannels(item, index)
      }
    },
    // 非编辑状态下，点击进入该频道
    intoChannels (item, index) {
      // console.log(item,index)
      this.$emit('info', index)
    },
    // 编辑状态下，点击删除该频道
    async delChannels (item, index) {
      item.seq = index + 1
      console.log(item, index)
      // 登录时
      if (this.user) {
        // console.log(item)
        const data = await delChannel(item)
        this.arrChannel.splice(index, 1)
        console.log(data)
      } else {
        // 未登录时
        this.arrChannel.splice(index, 1)
        window.localStorage.setItem('localChannel', JSON.stringify(this.arrChannel))
      }
    }
  }
}
</script>
<style lang='less' scoped>
.van-panel__content /deep/ .popup_btn {
  position: absolute;
  right: 10px;
  top: 0%;
  transform: translateY(50%);
  font-size: 20px;
  // width: 150px;
}
.popup_div {
  font-size: 30px;
  .van-icon {
    position: absolute;
    right: 32px;
    top: 8px;
  }
}
.recommend {
  margin-top: 40px;
}
.van-panel__content /deep/ .van-grid-item__text {
  color: #000;
}
.actives {
  color: red;
}
</style>
