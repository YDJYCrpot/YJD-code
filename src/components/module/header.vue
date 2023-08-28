<template>
	<div :class="$store.state.siteType == 'white' ? 'header' : 'header black'">
		<div class="headContent">
			<div class="left">
				<img src="../../assets/img/logo.png" alt="" class="logo-img" v-if="$store.state.siteType == 'white'">
				<img src="../../assets/img/logo-black.png" alt="" class="logo-img" v-if="$store.state.siteType == 'black'">
			</div>
			<div class="right">
				<div class="li wallet" @click="toWallet()">
					<img src="../../assets/img/wallet.png" alt="" srcset="" v-if="$store.state.siteType == 'white'">
					<img src="../../assets/img/wallet-black.png" alt="" srcset="" v-if="$store.state.siteType == 'black'">
					<span>{{$store.state.isLink ? $store.state.userAddress : $t('header.wallet') | longAddress}}</span>
				</div>
				<van-popover
				  v-model="showPopover"
				  trigger="click"
				  placement="bottom-end"
				  :actions="actions"
				  @select="onSelect"
				>
					<template #reference>
						<div class="li lang">
							{{$i18n.locale == 'en-US' ? 'EN' : 'CN'}} &nbsp;
							<img src="../../assets/img/lang-select.png" alt="" v-if="$store.state.siteType == 'white'">
							<img src="../../assets/img/lang-select-black.png" alt="" v-if="$store.state.siteType == 'black'">
						</div>
					</template>
				</van-popover>
			</div>
		</div>
		
		<van-dialog v-model="ConnectWalletShow" title="" :show-confirm-button="false">
			<div class="wallet-box">
				<div class="title-wallet">
					<span>Connect to a wallet</span>
					<img src="../../assets/wallet/close.png" @click="ConnectWalletShow = false">
				</div>
				<div class="wallet-list">
					<div class="li" @click="linkWalletFun()">
						<span>Metamask</span>
						<img src="../../assets/wallet/metamask.png">
					</div>
					<div class="li" @click="linkWalletFun()">
						<span>WalletConnect</span>
						<img src="../../assets/wallet/wallet.svg">
					</div>
				</div>
			</div>
		</van-dialog>
		
		<van-popup v-model="bindShow" position="bottom" >
			<div class="bind-box">
				<div class="close" @click="bindShow = false"></div>
				<div class="title" v-text="$t('header.bind')"></div>
				<input class="friend-Address" type="text" v-model="bindAddress">
				<div class="group-btn" @click="toBind()" v-if="!bingLoading" v-text="$t('header.confirm')">确认</div>
				<div class="group-btn" v-if="bingLoading">
					<van-loading type="spinner" size="18" />
				</div>
			</div>
		</van-popup>

	</div>
</template>

<script>
	import Bus from '@/components/bus.js';
	import Vue from 'vue';
	import {
		Icon,
		Popover,
		Popup,
		Toast,
		Switch,
		Loading
	} from 'vant';
	Vue.use(Icon)
		.use(Popover)
		.use(Popup)
		.use(Toast)
		.use(Switch)
		.use(Loading)
	import {
		linkWallet
	} from '../../contract/linkWallet.js'
	import { linkWalletTron } from '../../contract/linkWalletTron.js'

	export default {
		name: 'headContent',
		components: {},
		data() {
			return {
				ConnectWalletShow: false,
				active : 0,
				
				bindAddress : '',
				bindShow : false,
				bingLoading : false,
				setTimeBind : '',
				
				showPopover: false,
				actions: [{ text: 'English',val : 'en-US' }, { text: '中文',val : 'zh-CN' }, { text: this.$t('header.white'),val : 'white' }, { text: this.$t('header.black'),val : 'black' }],
			};
		},
		created() {
			let _this = this;
			if (this.$cookies.get('lang')) {
				this.$i18n.locale = this.$cookies.get('lang')
			}
			if (this.$cookies.get('siteType')) {
				this.$store.commit('siteTypeChange', this.$cookies.get('siteType'));
			}

			this.active = this.$route.name;
			
			if(this.$store.state.isLink){
				this.initData();
			}
			
			Bus.$on('showBindPopup',()=>{
				_this.bindShow = true;
			})
		},
		watch: {
			'$store.state.chainId.id'(newval,oldval){
				this.initData();
			},
			'$route'(newval,old){
				this.active = newval.name;
			}
		},
		filters: {
			longAddress(val) {
				if (val == 'chainIdError') {
					return 'Connect';
				}
				if (val) {
					if(val.length > 6){
						return val.substring(0, 4) + '...' + val.substring(val.length - 5, val.length);
					}
					return val
				} else {
					return 'Connect';
				}
			}
		},
		mounted() {
			this.linkWalletFun();
			let count = 1;
			let _this = this;
			let walletLink = setInterval(()=>{
				if(!this.$store.state.isLink){
					count++
					_this.linkWalletFun();
				}else{
					clearInterval(walletLink)
				}
				if(count > 20){
					clearInterval(walletLink)
				}
			},100)
			
		},
		methods: {
			initData(){
				
			},
			linkWalletFun() {
				let _this = this;
				linkWallet((bool, chainId, address) => {
					_this.ConnectWalletShow = false;
					if(chainId != 42161){
						Toast(_this.$t('header.changeNode'));
						window.ethereum.request({
						    method: 'wallet_switchEthereumChain',
						    params: [
						        {
						            chainId: web3js.utils.numberToHex(42161) //链id
						        }
						    ]
						})
						return;
					}
					_this.$cookies.set('address', address);
					_this.$store.commit('userAddressChange', address);
					_this.$store.commit('isLinkChange', true);
					
					coins.REF.contract.methods.user_referrer(_this.$store.state.userAddress).call((error, result) => {
						if (!error) {
							if (result == 0) {
								_this.$store.commit('isBindChange', false);
								if (_this.$route.query.r && (_this.$route.query.r != _this.$store.state.userAddress)) {
									_this.bindAddress = _this.$route.query.r;
									_this.bindShow = true;
								}
							}
						}
					})
				})
			},
			toBind() {
				let _this = this;
				if (this.bindAddress.indexOf('0x') == -1 || this.bindAddress.length != 42) {
					Toast(this.$t('header.addressError'))
					return;
				}
				
				coins.REF.contract.methods.user_referrer(_this.bindAddress).call((error, result) => {
					if (!error) {
						if (result == 0) {
							Toast(_this.$t('header.addressNoBind'));
						}else{
							let calldata = coins.REF.contract.methods.register(_this.bindAddress).encodeABI()
							_this.checkContract(coins.REF.contract._address, calldata, (isSuccess) => {
								if (isSuccess) {
									_this.bingLoading = true;
									coins.REF.contract.methods.register(_this.bindAddress).send({from: _this.$store.state.userAddress})
									.on('transactionHash', (result) => {
										_this.setTimeBind = setTimeout(() => {
											_this.bingLoading = false;
										}, 15000)
										if (result) {
											Toast(_this.$t('header.blockLoading'));
										}
									})
									.on('receipt', (receipt) => {
										_this.bingLoading = false;
										_this.bindShow = false;
										Bus.$emit('refreshData')
										Toast(_this.$t('header.bindSuccess'));
										clearTimeout(_this.setTimeBind)
									})
									.on('error', (err) => {
										_this.bingLoading = false;
									})
								} else {
							
								}
							});
						}
					}
				})
				
			},
			async checkContract(contractAddress, calldata, callback) {
				let _this = this;
				let estimate = await new Promise((resolve) => {
					web3js.eth.estimateGas({
						from: _this.$store.state.userAddress,
						to: contractAddress,
						data: calldata
					}).then(function(gasAmount) {
						resolve({
							success: true,
							data: gasAmount
						})
					}).catch(function(error) {
						resolve({
							success: false,
							msg: error.message
						})
					})
				})
				if (!estimate.success) {
					if (estimate.msg.indexOf("code") > 0) {
						const json = JSON.parse(estimate.msg.substring(estimate.msg.indexOf('{'), estimate.msg.indexOf(
							'}') + 1))
						Toast(json.message.split("execution reverted:")[1])
					} else {
						Toast(estimate.msg.split("execution reverted:")[1])
					}
					callback(false)
					return;
				}
				callback(true)
			},
			changeLang() {
				if(this.$i18n.locale == 'zh-CN'){
					this.$i18n.locale = 'en-US'
					this.$cookies.set('lang', 'en-US');
				}else{
					this.$i18n.locale = 'zh-CN'
					this.$cookies.set('lang', 'zh-CN');
				}
			},
			onSelect(action) {
				if(action.val == 'white' || action.val == 'black'){
					this.$cookies.set('siteType', action.val);
					this.$store.commit('siteTypeChange', action.val);
					return;
				}
				this.$i18n.locale = action.val
				this.$cookies.set('lang', action.val);
			},
			toWallet(){
				if(this.$store.state.isLink){
					return;
				}
				this.ConnectWalletShow = true;
			},
			openUrl(url) {
				window.open(url)
			},
			toURL(url){
				this.$router.push({
					path : url
				})
			},
		}
	};
</script>


<style lang="scss">
	::-webkit-scrollbar {
		display: none;
	}
</style>

<style lang="scss" scoped>
	.header {
		width: 100%;
		height: 0.96rem;
	}

	/deep/.van-overlay {
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(10px);
	}

	.headContent {
		width: 100%;
		height: 0.96rem;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		background: #ffffff;
		padding: 0 0.24rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		// border-bottom: 0.01rem solid #333639;
		.left{
			display: flex;
			align-items: center;
			height: 0.64rem;
			.logo-img{
				width: 2.18rem;
				// height: 0.32rem;
			}
			.pc-nav{
				display: flex;
				align-items: center;
				color: rgb(255, 255, 255);
				margin-left: 40px;
				display: none;
				.li{
					padding: 0 20px;
					font-size: 14px;
					opacity: 0.8;
				}
				.active{
					color: rgb(36, 107, 253);
				}
			}
		}
		.right{
			display: flex;
			align-items: center;
			.li{
				width: 0.96rem;
				height: 0.96rem;
				display: flex;
				justify-content: center;
				align-items: center;
				img{
					width: 0.48rem;
					height: 0.48rem;
				}
			}
			.net-img{
				img{
					width: 0.4rem;
					height: 0.4rem;
				}
			}
			.wallet,.lang{
				width: auto;
				height: 0.48rem;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 0.16rem;
				font-size: 0.24rem;
				color: #000000;
				border: 0.02rem solid #000000;
				min-width: 1.6rem;
				border-radius: 1rem;
				margin-right: 0.3rem;
				// font-weight: bold;
				img{
					width: 0.32rem;
					height: 0.32rem;
				}
				span{
					margin-left: 0.08rem;
				}
			}
			.lang{
				padding: 0 0.2rem;
				width: fit-content;
				min-width: 0;
				img{
					width: 0.2rem;
					height: auto;
				}
			}
		}
	}
	
	.wallet-box {
		.title-wallet {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 1.2rem;
			padding: 0 0.3rem;
			border-bottom: 0.02rem solid #999;
	
			span {
				font-size: 0.3rem;
				font-weight: bold;
				color: #333;
			}
	
			img {
				width: 0.7rem;
				height: 0.7rem;
			}
		}
	
		.wallet-list {
			padding: 0.5rem .3rem;
	
			.li {
				width: 100%;
				height: 0.8rem;
				background: #152742;
				border-radius: 1rem;
				margin-top: 0.5rem;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-shadow: 0px 0.03rem 0.06rem rgba(135, 64, 192, 0.2);
				padding: 0 0.3rem;
				cursor: pointer;
				
				span {
					color: #fff;
					font-weight: bold;
					font-size: 0.3rem;
				}
	
				img {
					width: 0.5rem;
				}
			}
	
			.li:first-child {
				margin: 0;
			}
		}
	}
	.bind-box{
		width: 100%;
		min-height: 3rem;
		background: #fff;
		border-radius: 0.24rem 0.24rem 0 0;
		position: relative;
		padding-bottom: 0.48rem;
		.close{
			width: 0.48rem;
			height: 0.48rem;
			position: absolute;
			left: 0.27rem;
			top: 0.35rem;
			background: url('../../assets/img/close-pop.png') no-repeat;
			background-size: 100% 100%;
		}
		.title{
			text-align: center;
			font-size: 0.32rem;
			color: #000;
			font-weight: bold;
			padding: 0.48rem 0;
		}
		
		.friend-Address{
			display: block;
			width: 6.86rem;
			margin: 0 auto;
			border: 0.02rem solid #E4D3D3;
			// background: #181924;
			border-radius: 0.16rem;
			height: 0.9rem;
			margin: 0 auto;
			margin-top: 0.24rem;
			padding-left: 0.2rem;
			box-sizing: border-box;
			color: #000;
		}
		.group-btn{
			width: 6rem;
			margin-top: 0.48rem;
		}
	}

	.black{
		.headContent{
			background: #070505;
			border-bottom: 0.02rem solid #333639;
		}
		.headContent .right .li{
			border: 0.02rem solid #3B3E49;
			color: #fff;
			span{
				color: #fff;
			}
		}
		
	}

	@media (min-width: 900px) {
		.headContent{
			.left{
				cursor: pointer;
			}
			.right .li{
				cursor: pointer;
			}
		}
		.headContent .left .pc-nav{
			display: flex;
		}
		.bind-box{
			width: 800px;
		}
		.bind-box .close{
			cursor: pointer;
		}
		.bind-box .friend-Address{
			width: 700px;
		}
	}

	.van-popup {
		background: rgba(0, 0, 0, 0);
	}

	/deep/.van-popup--top {
		width: 100vw;
	}
	
	
</style>
