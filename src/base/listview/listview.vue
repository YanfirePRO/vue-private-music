<template>
	<scroll ref="listview" class="listview" :data="data" :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType">
		<ul>
			<li ref="listGroup" v-for="group in data" class="list-group">
				<h2 class="list-group-title">{{group.title}}</h2>
				<ul>
					<li v-for="item in group.items" class="list-group-item">
						<img class="avatar" v-lazy="item.avatar" />
						<span class="name">{{item.name}}</span>
					</li>
				</ul>
			</li>
		</ul>
		<div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
			<ul>
				<li v-for="(item,index) in shortcutList" class="item" :class="{'current': currentIndex === index}" :data-index="index">
				{{item}}
				</li>
			</ul>
		</div>
	</scroll>
	
</template>

<script>
	import Scroll from 'base/scroll/scroll'
	import {getData} from 'common/js/dom'

	const ANCHOR_HEIGHT = 18

	export default{
		components:{
			Scroll
		},
		props: {
			data: {
				type: Array,
				default: []
			}
		},
		data(){
			return {
				scrollY: -1,
				currentIndex: 0
			}
		},
		created(){
			this.touch = {}
			this.listenScroll = true
			this.listHeight = []
			this.probeType = 3
		},
		computed:{
			shortcutList(){
				return this.data.map((group) => {
					return group.title.substr(0, 1)
				})
			}
		},
		watch:{
			data(val){
				setTimeout(() => {
					this._calculateHeight()
				}, 20)
			},
			scrollY(newY){
				const listHeight = this.listHeight
				for(let i = 0; i < listHeight.length; i++){
					let height1 = listHeight[i]
					let height2 = listHeight[i+1]
					if(!height2 || (-newY) > height1 && (-newY) < height2){
						this.currentIndex = i
						console.log("currentIndex:", this.currentIndex)
						return
					}
				}
				this.currentIndex = 0
			}
		},
		methods:{
			onShortcutTouchStart(e){
				console.log(e)
				let anchorIndex = getData(e.target, 'index')
				let firstTouch = e.touches[0]
				this.touch.y1 = firstTouch.pageY
				this.touch.anchorIndex = anchorIndex
				this._scrollTo(anchorIndex)
			},
			onShortcutTouchMove(e){
				console.log("触发touchmove")
				let firstTouch = e.touches[0]
				this.touch.y2 = firstTouch.pageY
				let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
				let anchorIndex = parseInt(this.touch.anchorIndex) + delta
				console.log("当前到达的index ", delta ,anchorIndex)
				this._scrollTo(anchorIndex)
			},
			_scrollTo(index){
				this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
			},
			//监听滚动事件
			scroll(pos){
				this.scrollY = pos.y
			},
			//计算高度
			_calculateHeight(){
				this.listHeight = []
				const list = this.$refs.listGroup
				let height = 0
				this.listHeight.push(height)
				for(let i = 0; i < list.length; i++){
					let item = list[i]
					height += item.clientHeight
					this.listHeight.push(height)
				}
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	
	.listview
		postion: relative
		width 100%
		height 100%
		overflow hidden
		background $color-background
		.list-group
			padding-bottom 30px
			.list-group-title
				height 30px
				line-height 30px
				padding-left 20px
				font-size $font-size-small
				color $color-text-l
				background $color-highlight-background
			.list-group-item
				display flex
				align-items: center
				padding 20px 0 0 30px
				.avatar
					width 50px
					height 50px
					border-radius 50%
				.name
					margin-left 20px
					color $color-text-l
					font-size $font-size-medium
		.list-shortcut
			position absolute
			z-index 30
			right 0
			top 50%
			transform translateY(-50%)
			width 20px
			padding 20px 0
			border-radius 10px
			text-align center
			background $color-background-d
			font-family Helvetica
			.item
				padding 3px
				line-height 1
				color $color-text-l
				font-size $font-size-small
				&.current
					color $color-theme
		.list-fixed
			position absolute
			top 0
			left 0
			width 100%
			.fixed-title
				height 30px
				line-height 30px
				padding-left 20px
				font-size $font-size-small
				color $color-text-l
				background $color-highlight-background
		.loading-container
			position absolute
			width 100%
			top 50%
			transform translateY(-50%)
</style>