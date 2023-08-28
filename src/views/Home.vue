<template>
	<div class="homes">
		<router-view></router-view>
	</div>
</template>

<script>
	import Vue from 'vue';
	import {
		Notify,Tabbar, TabbarItem
	} from 'vant';
	Vue.use(Notify).use(Tabbar).use(TabbarItem);

	import Bus from '@/components/bus.js';
	export default {
		name: 'homes',
		components: {
		},
		data() {
			return {
				
			};
		},
		watch:{
			
		},
		created() {
			
		},
		methods: {
			
		},
		mounted() {}
	};
</script>

<style lang="scss">
	.van-tabbar{
		background: #121418!important;
		box-shadow: 0px -2px 8px rgba(0, 0, 0, 0.5);
	}
	.van-tabbar-item--active{
		background: #121418!important;
	}
	[class*=van-hairline]::after{
		/* border: 0 solid #3B3E49!important; */
	}
	.van-tabbar-item{
		/* opacity: 0.8; */
	}
	
	.van-popup {
		background-color: rgba(0, 0, 0, 0) !important;
	}

	.van-overlay {
		background: #b6bfbea6 !important;
		backdrop-filter: blur(10px);
	}

	.van-dialog {
		background-color: rgba(0, 0, 0, 1) !important;
	}

	.van-button--default {
		background-color: rgba(0, 0, 0, 1) !important;
	}
	
	
	.pop-content{
		width: 100%;
		background: #fff;
		padding: 0.48rem;
		border-radius: 0.4rem 0.4rem 0 0;
		.top-up{
			display: flex;
			align-items: center;
			justify-content: space-between;
			span{
				font-size: 0.48rem;
				color: #191B1E;
				font-weight: bold;
			}
			.close{
				width: 0.64rem;
				height: 0.64rem;
				display: flex;
				align-items: center;
				justify-content: center;
				img{
					width: 0.48rem;
					height: 0.48rem;
				}
			}
		}
	}
	
</style>

<style lang="scss" scoped="scoped">
	.homes {
		min-height: 100vh;
		white-space: normal;
		// word-break: break-all;
		margin: 0 auto;
	}

	@media (min-width: 900px) {
		.bottom-nav{
			display: none;
		}
	}
</style>