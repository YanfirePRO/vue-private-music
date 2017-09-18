import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getSingerList(){
	let url = 'https://szc.y.qq.com/v8/fcg-bin/v8.fcg'

	const data = Object.assign({},commonParams,{
		channel: 'singer',
		page: 'list',
		key: 'all_all_all',
		pagesize: 100,
		pagenum: 1,
		loginUin: 0,
		hostUin: 0,
		g_tk: 5381,
		platform: 'yqq',
		format: 'jsonp'
	})

	return jsonp(url, data, options)
}