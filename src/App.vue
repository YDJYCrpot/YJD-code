<template>
	<div id="app">
		<HEADER></HEADER>
		<router-view />
	</div>
</template>

<script>
	import HEADER from './components/module/header.vue';
	import Vue from "vue";
	import {
		Tabbar,
		TabbarItem,
		Toast,
		Notify,
		Dialog
	} from "vant";
	Vue.use(Tabbar).use(TabbarItem).use(Notify).use(Dialog);
	import store from './store.js'

	export default {
		name: 'App',
		components: {
			HEADER
		},
		data() {
			return {
				transitionName: "vux-pop-out"
			}
		},
		computed: {
			winWidth: function winWidth() {
				return window.innerWidth;
			},
			winHeight: function winHeight() {
				return window.innerHeight;
			},
		},
		created() {
			document.body.removeChild(document.getElementById('Loading'));
			this.mediaChange(this.winWidth);

			let _this = this;
			if (document.body.clientWidth > 750) {
				this.mediaChange(375);
			} else {
				this.mediaChange(this.winWidth);
			}

			window.onresize = function() {
				if (document.body.clientWidth > 750) {
					_this.mediaChange(375);
				} else {
					_this.mediaChange(_this.winWidth);
				}
			}
			function IsPC() {
				var userAgentInfo = navigator.userAgent;
				var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
				var flag = true;
				for (var v = 0; v < Agents.length; v++) {
					if (userAgentInfo.indexOf(Agents[v]) > 0) {
						flag = false;
						break;
					}
				}
				return flag;
			}
			this.$store.commit('isPcChange',IsPC())
		},
		methods: {
			mediaChange(width) {
				let mediafontSize = width / (750 / 100);
				let mediaHtml = document.querySelector('html');

				mediaHtml.style.fontSize = mediafontSize + 'px';
			}
			
		},
		watch: {
			'$route'(to, from) {
				if (to.meta.index < from.meta.index) {
					this.transitionName = 'vux-pop-out'
				} else {
					this.transitionName = 'vux-pop-in'
				}
			},
		}

	}
</script>

<style lang="scss">
	body,
	html,
	#app {
		padding: 0;
		margin: 0 auto;
		height: 100%;
		position: relative;
		overflow-x: hidden;
		// font-family: "Poppins",sans-serif;
		font-family: "MiSans",sans-serif;
		-moz-osx-font-smoothing: grayscale;
		-webkit-font-smoothing: antialiased;
		background-color: #fff;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		font-weight: normal;
	}
	
	body {
		font-size: 14px;
		background: #fff;
		height: 100%;
	}
	div {
		box-sizing: border-box;
	}

	.no-data {
		text-align: center;
		color: #666;
		font-size: 0.26rem;
		padding: 0.24rem 0;
		cursor: pointer;
	}
	.group-btn{
		width: 100%;
		height: 0.72rem;
		margin: 0 auto;
		background: #246BFD;
		border-radius: 1rem;
		// text-align: center;
		// line-height: 0.96rem;
		color: #FFFFFF;
		font-size: 0.28rem;
		font-weight: bold;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 0.01rem solid #68A1FF;
	}
	.group-btn:active{
		opacity: 0.8;
	}
	.popup-bottom-box{
		background: #fff;
		padding: 0.48rem;
		padding-bottom: 0;
		border-radius: 0.24rem 0.24rem 0 0;
		.top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title{
				font-size: 0.48rem;
				font-weight: bold;
			}
			.close{
				width: 0.52rem;
				height: 0.52rem;
				background: url("assets/img/close-pop.png") no-repeat;
				background-size: 100% 100%;
			}
		}
	}
	.dialog-content-box{
		padding: 0.48rem;
		background-size: cover;
		border-radius: 0.4rem;
		.dialog-title{
			font-size: 0.48rem;
			color: #FFFFFF;
			font-weight: bold;
		}
		h2{
			font-size: 0.32rem;
			color: #F7BA1E;
			margin-top: 0.36rem;
			font-weight: bold;
		}
		.infos{
			padding-left: 0.22rem;
			ul{
				list-style: auto;
			}
			li{
				padding: 0.05rem 0;
				font-size: 0.24rem;
				color: #fff;
			}
		}
		.confirm-btn{
			padding: 0.18rem 0.1rem;
			min-width: 2.16rem;
			background: #F7BA1E;
			border-radius: 1rem;
			margin: 0 auto;
			font-size: 0.28rem;
			color: #191B1E;
			font-weight: bold;
			width: fit-content;
			text-align: center;
			margin-top: 0.6rem;
		}
	}
	input{
		border: none;
		outline: none;
		background: none;
	}
	input[type=number]::-webkit-inner-spin-button, 
	input[type=number]::-webkit-outer-spin-button { 
		-webkit-appearance: none; 
		margin: 0; 
	}
	h1,h2,h3,h4,h5,h6{
		margin: 0;
		padding: 0;
		font-weight: 200;
		box-sizing: border-box;
	}
	
	.van-toast{
		background: #1F222A!important;
		padding: 0.26rem 0.64rem;
		box-shadow: 0px 0.04rem 0.16rem rgba(0, 0, 0, 0.25), 0px 0px 0.4rem rgba(0, 0, 0, 0.25);
	}
	
	@media (min-width: 900px) {
		.van-popup--center{
			top: 20%!important;
		}
	}
		
</style>
