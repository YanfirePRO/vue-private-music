<template>
	<div class="singer">
		<list-view :data="singers"></list-view>
	</div>
</template>

<script>
	import {getSingerList} from 'api/singer'
	import {ERR_OK} from 'api/config'
	import Singer from 'common/js/singer'
	import ListView from 'base/listview/listview' 

	const HOT_NAME = '热门'
	const HOT_SINGER_LEN = 10

	export default{
		components:{
			ListView
		},
		data(){
			return{
				singers: []
			}
		},
		created(){
			this._getSingerList()
		},
		methods:{
			_getSingerList(){
				getSingerList().then(res=>{
					if(res.code === ERR_OK){
						this.singers = this.normalizeSinger(res.data.list)
					}
				})
			},
			normalizeSinger(list){

				let map ={
					hot: {
						title: HOT_NAME,
						items: []
					}
				}

				list.forEach((item, index) => {
					if(index < HOT_SINGER_LEN){
						map.hot.items.push(new Singer({
							id: item.Fsinger_mid,
							name: item.Fsinger_name
						})
						)
					}

					const key = item.Findex

					if(!map[key]){
						map[key] = {
							title: key,
							items: []
						}
					}

					map[key].items.push(new Singer({
							id: item.Fsinger_mid,
							name: item.Fsinger_name
						})
					)
				})
				console.log("map:",map)

				//对象的遍历是无序的，所以需要将对象排序
				let hot = []
				let ret = []

				for (let key in map){
					let val = map[key]
					if (val.title.match(/[a-zA-z]/)){
						ret.push(val)
					}
					else if (val.title === HOT_NAME){
						hot.push(val)
					}
				}

				//排序
				ret.sort((a, b) => {
					return a.title.charCodeAt(0) - b.title.charCodeAt(0);
				})

				hot = hot.concat(ret);
				console.log("arr:", hot)

				return  hot
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.singer
		position fixed
		top 88px
		bottom 0
		width 100%
</style>