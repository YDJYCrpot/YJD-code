import Vue from 'vue'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies'

Vue.use(Vuex)
import BigNumber from './contract/bignumber.js'

export default new Vuex.Store({
	state: {
		isPc : false,
		isLink : false,
		userAddress : '' , 
		loginId : '',
		isBind : false,
		token : '',
		invAddress : '',
		siteType : 'white'
	},
	mutations: {
		isPcChange(state, val){
			state.isPc = val
		},
		isLinkChange(state, val){
			state.isLink = val
		},
		userAddressChange(state, val){
			state.userAddress = val
		},
		loginIdChange(state, val){
			state.loginId = val
		},
		isBindChange(state, val){
			state.isBind = val
		},
		tokenChange(state, val){
			state.token = val
		},
		invAddressChange(state, val){
			state.invAddress = val
		},
		siteTypeChange(state, val){
			state.siteType = val
		}
	},
	actions: {

	}
})
