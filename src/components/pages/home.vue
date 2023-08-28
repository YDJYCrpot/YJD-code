<template>
	<div :class="$store.state.siteType == 'white' ? 'home' : 'home black'" >
		<van-pull-refresh v-model="refreshLoading" @refresh="onDownRefresh">
			<div class="content">
				<div class="statement">
					{{$t('main.m1')}}<br/>
					{{$t('main.m2')}}
				</div>
				<div class="group-title">
					<div class="name">
						<img src="../../assets/img/title-img.png" alt="">
						<span v-text="$t('main.todayMintData')"></span>
					</div>
				</div>
				<div class="echarts-box">
					<div id="echarts-main"></div>
					
					<div class="last-mint-sum">
						<div class="sum">{{info.totalAmountDebt | formatDecimalFilData129}}</div>
						<div class="text" v-text="$t('main.userMint')"></div>
					</div>
				</div>

				<div class="list-pool">
					<div class="li">
						<div class="text">
							<div class="color-box"></div>
							<span v-text="$t('main.data_1')"></span>
						</div>
						<div class="num">{{info.upReward | formatDecimalFilData}}</div>
					</div>
					<div class="li">
						<div class="text">
							<div class="color-box green"></div>
							<span v-text="$t('main.data_2')"></span>
						</div>
						<div class="num">{{info.downReward | formatDecimalFilData}}</div>
					</div>
					<div class="li">
						<div class="text">
							<div class="color-box yellow"></div>
							<span v-text="$t('main.data_3')"></span>
						</div>
						<div class="num">{{info.aReward | formatDecimalFilData}}</div>
					</div>
					<div class="li">
						<div class="text">
							<div class="color-box red"></div>
							<span v-text="$t('main.data_4')"></span>
						</div>
						<div class="num">{{info.totalAmountA | formatDecimalFilData}}</div>
					</div>
				</div>
				<div class="mint-btn" @click="mint()" v-if="!mint_Load">
					Mint
				</div>
				<div class="mint-btn" v-if="mint_Load">
					<van-loading type="spinner" size="18" />
				</div>


				<div class="mint-info">
					<!-- {{userBalance.USDT_earnedReward}}<br/> -->
					<!-- {{userBalance.YDJ_earnedReward}}<br/> -->
					{{$t('main.canMint')}} ≈{{userBalance.YDJ_earnedReward | formatDecimalFil}} YDJ<br />
					{{$t('main.mintRule')}}
				</div>
				<div class="group-title">
					<div class="name">
						<img src="../../assets/img/title-img.png" alt="">
						<span v-text="$t('main.shareMint')"></span>
					</div>
					<div class="text">
						{{$t('main.teamPool')}} {{teamNum}} {{$t('main.people')}}
					</div>
				</div>
				<div class="input-box">
					<input type="text" disabled v-model="shareLink" v-if="isBind == true">
					<div class="group-btn" v-if="isBind == false" @click="showBind()" v-text="$t('main.bindAddress')"></div>
					<img class="copy" src="../../assets/img/copy.png" v-clipboard:copy="shareLink"
						v-clipboard:success="onCopy">
				</div>
				<div class="group-title">
					<div class="name">
						<img src="../../assets/img/title-img.png" alt="">
						<span v-text="$t('main.getMintPer')"></span>
					</div>
				</div>
				<div class="swap-box">
					<div class="coin-box">
						<div class="balance-top">
							<span v-text="$t('main.add')"></span><span>{{userBalance.USDT | formatDecimalFil}} {{$t('main.available')}}</span>
						</div>
						<div class="input-ct">
							<div class="left">
								<span>USDT</span>
							</div>
							<input type="number" placeholder="0.00" v-model="USDT_Amount">
						</div>
					</div>
					<div class="add">
						<img src="../../assets/img/home/add.png" alt="">
					</div>
					<div class="coin-box">
						<div class="balance-top">
							<span v-text="$t('main.add')"></span><span>{{userBalance.YDJ | formatDecimalFil}} {{$t('main.available')}}</span>
						</div>
						<div class="input-ct">
							<div class="left">
								<span>YDJ</span>
							</div>
							<input type="number" disabled placeholder="0.00" v-model="YDJ_Amount">
						</div>
					</div>
				</div>

				<!-- 牛 -->
				<div class="group-btn" v-if="USDT_Auth < USDT_Amount && !USDT_Approe_Load" @click="appove('USDT')" v-text="$t('main.apporveUsdt')"></div>
				<div class="group-btn" v-if="USDT_Auth < USDT_Amount && USDT_Approe_Load"><van-loading type="spinner" size="18" /></div>
				<div class="group-btn" v-if="YDJ_Auth < YDJ_Amount && !YDJ_Approe_Load" @click="appove('YDJ')" v-text="$t('main.appoverYDJ')"></div>
				<div class="group-btn" v-if="YDJ_Auth < YDJ_Amount && YDJ_Approe_Load"><van-loading type="spinner" size="18" /></div>

				<div :class="(USDT_Auth >= USDT_Amount && YDJ_Auth >= YDJ_Amount) ? 'group-btn' : 'group-btn group-btn-no'"
					@click="stake">
					<span v-if="!state_Load"  v-text="$t('main.addLpGetMintPer')"></span>
					<van-loading type="spinner" size="18" v-if="state_Load" />
				</div>

				<div class="info">
					<h2 v-text="$t('main.mintRule_2')"></h2>
				</div>
				<div class="group-title">
					<div class="name">
						<img src="../../assets/img/title-img.png" alt="">
						<span v-text="$t('main.shareData')"></span>
					</div>
					<div class="down" @click="showPushList()">
						<img src="../../assets/img/down.png" alt="" srcset="">
					</div>
				</div>
				<div class="push-list" v-if="isShowPush">
					<div class="li" v-for="(el,i) in pushList" :key="i">
						{{el}}
					</div>
				</div>
				<div class="group-title">
					<div class="name">
						<img src="../../assets/img/title-img.png" alt="">
						<span v-text="$t('main.mintRule_3')"></span>
					</div>
				</div>
				<div class="other-btn" @click="openUrl('ydj')"  v-text="$t('main.tokenContract')"></div>
				<div class="other-btn" @click="openUrl('main')" v-text="$t('main.mainContract')"></div>
				<div class="other-btn" @click="addToken()" v-text="$t('main.addTokenToWallet')"></div>
				<div class="other-btn" @click="openUrl('trans')" v-text="$t('main.toTrade')"></div>
				<div class="info">
					<h2>
						{{$t('main.mintRule_4')}}
						<br>{{$t('main.mintRule_5')}}
					</h2>
				</div>
				<img class="wallet-list" src="../../assets/img/wallet-list.png" alt="" v-if="$store.state.siteType == 'white'">
				<img class="wallet-list" src="../../assets/img/wallet-list-black.png" alt="" v-if="$store.state.siteType == 'black'">
				<div class="info">
					<h2 v-text="$t('main.walletCanUse')">
						
					</h2>
				</div>
			</div>
		</van-pull-refresh>
	</div>
</template>

<script>
	import Vue from 'vue';
	import {
		NoticeBar,
		Swipe,
		SwipeItem,
		Toast,
		PullRefresh
	} from 'vant';
	Vue.use(NoticeBar).use(Swipe).use(SwipeItem).use(Toast).use(PullRefresh);
	import BigNumber from '../../contract/bignumber.js';

	window.bn = BigNumber

	import Bus from '@/components/bus.js';
	export default {
		data() {
			return {
				info: "",
				downAmounts: 0,
				shareLink: 'loading...',
				teamNum: '--',
				price: 0,
				precisePrice: 0,
				USDT_Amount: '',
				YDJ_Amount: '',
				USDT_Auth: 0,
				USDT_Approe_Load: false,
				USDT_Approe_setTime: '',
				YDJ_Auth: 0,
				YDJ_Approe_Load: false,
				YDJ_Approe_setTime: '',
				state_Load: false,
				state_Load_setTime: '',
				mint_Load: false,
				mint_Load_setTime: '',
				last_state_usdt_num: 0,
				userBalance: {
					USDT: 0,
					YDJ: 0,
					USDT_earnedReward: 0,
					YDJ_earnedReward: 0
				},
				isBind: false,
				refreshLoading: false,
				RefAmount : 0,
				pushList : [],
				pageSize : 2,
				pageNum : 0,
				isShowPush : false,
				isMore : true
			};
		},
		filters: {
			longAddress(val) {
				if (val) {
					return val.substring(0, 10) + '...' + val.substring(val.length - 10, val.length);
				}
			},
			formatDecimalFil(num) {
				if (!num) {
					return 0;
				}
				if (num <= 0) {
					return 0
				}

				let decimal = 6
				num = BigNumber(num).toFixed(18)
				let index = num.indexOf('.')
				if (index !== -1) {
					num = num.substring(0, decimal + index + 1)
				} else {
					num = num.substring(0)
				}
				return parseFloat(num).toFixed(decimal)
			},
			formatDecimalFilData(num) {
				if (!num) {
					return 0;
				}
				if (num <= 0) {
					return 0
				}

				let decimal = 2
				num = num.toString()
				num = web3js.utils.fromWei(num, 'mwei')
				num = BigNumber(num).toFixed(18)
				let index = num.indexOf('.')
				if (index !== -1) {
					num = num.substring(0, decimal + index + 1)
				} else {
					num = num.substring(0)
				}
				return parseFloat(num).toFixed(decimal)
			},
			formatDecimalFilData129(num){
				if (!num) {
					return 0;
				}
				if (num <= 0) {
					return 0
				}

				let decimal = 2
				num = num.toString()
				num = web3js.utils.fromWei(num, 'mwei')
				num = BigNumber(Number(num) * 1.29).toFixed(18)
				let index = num.indexOf('.')
				if (index !== -1) {
					num = num.substring(0, decimal + index + 1)
				} else {
					num = num.substring(0)
				}
				return parseFloat(num).toFixed(decimal)
				
			}
		},
		created() {
			if (this.$store.state.isLink) {
				this.initData();
			}

			let _this = this;
			Bus.$on('refreshData', () => {
				_this.setInterData();
			})
		},
		mounted() {
			// this.echartsInit()
		},
		watch: {
			'$store.state.isLink'(newval, oldval) {
				this.initData();
			},
			'USDT_Amount'(newval, oldval) {
				if (newval == '') {
					this.YDJ_Amount = ''
					return;
				}
				if (newval <= 0) {
					this.YDJ_Amount = 0
					return;
				}
				this.YDJ_Amount = (new BigNumber(newval).multipliedBy(this.price)).toFixed(4)
			}
		},
		methods: {
			echartsInit(d1, d2, d3, d4) {
				d1 = Number(web3js.utils.fromWei(d1, 'mwei'));
				d2 = Number(web3js.utils.fromWei(d2, 'mwei'));
				d3 = Number(web3js.utils.fromWei(d3, 'mwei'));
				d4 = Number(web3js.utils.fromWei(d4, 'mwei'));
				this.$echarts.init(document.getElementById('echarts-main')).setOption({
					color:['#2679FD','#03C18E','#FF9B00','#FF3880'],
					angleAxis: {
						clockwise: false, 
						axisLine: {
							show: false
						},
						axisLabel: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						min: 0,
						max: d1 + d2 + d3 + d4, 
						startAngle: 0 
					},
					radiusAxis: {
						type: 'category',
						data: ['1', '2', '3', '4'], 
						z: 10,
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							show: false
						},
					},
					polar: {},
					series: [{
						type: 'bar',
						data: [0, 0, 0, d1],
						coordinateSystem: 'polar',
						name: 'A',
						roundCap: true,
						stack: 'a',
					}, {
						type: 'bar',
						data: [0, 0, 0, d2], 
						coordinateSystem: 'polar',
						name: 'B',
						stack: 'a',
						roundCap: true,
					}, {
						type: 'bar',
						data: [0, 0, 0, d3],
						coordinateSystem: 'polar',
						name: 'C',
						stack: 'a',
						roundCap: true,
					}, {
						type: 'bar',
						data: [0, 0, 0, d4],
						coordinateSystem: 'polar',
						name: 'D',
						stack: 'a',
						roundCap: true,
					}],
					legend: {
						show: false,
						data: ['A', 'B', 'C','D']
					}
				})
			},
			onDownRefresh() {
				this.setInterData();
				setTimeout(() => {
					this.refreshLoading = false
				}, 1500)
			},
			initData() {
				let _this = this;

				this.setInterData();
				setInterval(() => {
					_this.setInterData();
				}, 10000)

				this.shareLink = location.origin + '/#/?r=' + this.$store.state.userAddress;
				
			},
			showPushList(){
				this.isShowPush = !this.isShowPush;
				if(!this.isShowPush){
					return;
				}
				this.pageNum = 0;
				this.pushList = [];
				this.getRefAmount();
			},
			getRefAmount(){
				let _this = this;
				Toast.loading()
				coins.REF.contract.methods.getUserDirectReferNum(_this.$store.state.userAddress).call((error, result) => {
					if (!error) {
						_this.RefAmount = result;
						_this.getPushList();
					}
				})
			},
			getPushList(){
				if(!this.isMore){
					return;
				}
				let _this = this;
				coins.REF.contract.methods.getUserDirectRefers(_this.$store.state.userAddress,0,this.RefAmount).call((error, result) => {
					Toast.clear()
					if (!error) {
						_this.pushList = result;
					}
				})
			},

			stake() {
				let _this = this;
				if (this.USDT_Amount <= 0 || this.USDT_Amount == '') {
					return;
				}
				if (Number(this.USDT_Amount) > Number(this.userBalance.USDT)) {
					Toast(this.$t('main.toast_1'))
					return;
				}
				if (Number(this.YDJ_Amount) > Number(this.userBalance.YDJ)) {
					Toast(this.$t('main.toast_2'))
					return;
				}
				if (this.USDT_Auth < this.USDT_Amount) {
					return;
				}
				if (this.YDJ_Auth < this.YDJ_Amount) {
					return;
				}
				if (this.state_Load) {
					return;
				}
				if (this.USDT_Amount < (100) || this.USDT_Amount > (2000)) {
					Toast(this.$t('main.toast_3')+' ' + (100) + 'U - ' + (2000) + 'U')
					return;
				}
				if (this.USDT_Amount > this.last_state_usdt_num) {
					Toast(this.$t('main.toast_4')+' ' + this.last_state_usdt_num + 'U')
					return;
				}

				let calldata = coins.MODEL.contract.methods.stake(
					web3js.utils.toWei(this.USDT_Amount + '', 'mwei'),
					web3js.utils.toWei(this.YDJ_Amount + '', 'ether'),
				).encodeABI()
				this.checkContract(coins.MODEL.contract._address, calldata, (isSuccess) => {
					if (isSuccess) {
						_this.state_Load = true;
						coins.MODEL.contract.methods.stake(
								web3js.utils.toWei(_this.USDT_Amount + '', 'mwei'),
								web3js.utils.toWei(_this.YDJ_Amount + '', 'ether'),
							).send({
								from: _this.$store.state.userAddress
							})
							.on('transactionHash', (result) => {
								_this.state_Load_setTime = setTimeout(() => {
									_this.state_Load = false;
								}, 15000)
								if (result) {
									Toast(_this.$t('main.toast_5'))
									return;
								}
							})
							.on('receipt', (receipt) => {
								Toast(_this.$t('main.toast_6'))
								_this.USDT_Amount = 0;
								_this.state_Load = false;
								_this.setInterData();
								clearTimeout(_this.state_Load_setTime)
							}).on('error', (err) => {
								_this.state_Load = false;
							})
					} else {

					}
				});
			},
			mint() {
				let _this = this;
				if (_this.userBalance.USDT_earnedReward == 0) {
					return;
				}
				let calldata = coins.MODEL.contract.methods.getReward().encodeABI()
				this.checkContract(coins.MODEL.contract._address, calldata, (isSuccess) => {
					if (isSuccess) {
						_this.mint_Load = true;
						coins.MODEL.contract.methods.getReward().send({
								from: _this.$store.state.userAddress
							})
							.on('transactionHash', (result) => {
								_this.mint_Load_setTime = setTimeout(() => {
									_this.mint_Load = false;
								}, 15000)
								if (result) {
									Toast(_this.$t('main.toast_7'))
									return;
								}
							})
							.on('receipt', (receipt) => {
								Toast(_this.$t('main.toast_8'))
								_this.mint_Load = false;
								_this.setInterData();
								clearTimeout(_this.mint_Load_setTime)
							}).on('error', (err) => {
								_this.mint_Load = false;
							})
					} else {

					}
				});
			},
			onCopy() {
			},
			queryIsAuth(coin, callback) {
				let _this = this;
				try {
					coin.methods.allowance(_this.$store.state.userAddress, coins.MODEL.contract._address).call({
						from: _this.$store.state.userAddress
					}, function(err, result) {
						callback(result);
					});
				} catch (error) {
					console.log(error)
				}
			},

			appove(coin) {
				let _this = this;
				if (coin == 'USDT') {
					_this.USDT_Approe_Load = true;
					coins.USDT.contract.methods.approve(coins.MODEL.contract._address, '0xfffffffffffffffffffffffffffffff')
						.send({
							from: _this.$store.state.userAddress
						})
						.on('transactionHash', (result) => {
							_this.USDT_Approe_setTime = setTimeout(() => {
								_this.USDT_Approe_Load = false;
							}, 15000)
							if (result) {
								Toast(_this.$t('main.toast_10'))
								return;
							}
						})
						.on('receipt', (receipt) => {
							_this.USDT_Approe_Load = false;
							_this.setInterData();
							clearTimeout(_this.USDT_Approe_setTime)
						}).on('error', (err) => {
							_this.USDT_Approe_Load = false;
						})
				} else if (coin == 'YDJ') {
					_this.YDJ_Approe_Load = true;
					coins.YDJ.contract.methods.approve(coins.MODEL.contract._address, '0xfffffffffffffffffffffffffffffff')
						.send({
							from: _this.$store.state.userAddress
						})
						.on('transactionHash', (result) => {
							_this.YDJ_Approe_setTime = setTimeout(() => {
								_this.YDJ_Approe_Load = false;
							}, 15000)
							if (result) {
								Toast(_this.$t('main.toast_10'))
								return;
							}
						})
						.on('receipt', (receipt) => {
							_this.YDJ_Approe_Load = false;
							_this.setInterData();
							clearTimeout(_this.YDJ_Approe_setTime)
						}).on('error', (err) => {
							_this.YDJ_Approe_Load = false;
						})
				}
			},
			setInterData() {
				let _this = this;
				coins.MODEL.contract.methods.getUserInfo(_this.$store.state.userAddress).call((error, result) => {
					if (!error) {
						console.log(result);
						_this.info = result;
						let teamAum = 0;
						
						_this.$nextTick(()=>{
							_this.echartsInit(
								_this.info.upReward,
								_this.info.downReward,
								_this.info.aReward,
								_this.info.totalAmountA,
							)
						})
					}
				})

				coins.USDT.contract.methods.balanceOf(_this.$store.state.userAddress).call((error, result) => {
					if (!error) {
						_this.userBalance.USDT = web3js.utils.fromWei(result, 'mwei');
					}
				})
				coins.YDJ.contract.methods.balanceOf(_this.$store.state.userAddress).call((error, result) => {
					if (!error) {
						_this.userBalance.YDJ = web3js.utils.fromWei(result, 'ether');
					}
				})

				coins.camelotRouter.contract.methods.getAmountsOut(1000000, [coins.USDT.contract._address, coins.YDJ.contract._address]).call((error, result) => {
					if (!error) {
						let price = Number(web3js.utils.fromWei(result[1], 'ether')).toFixed(6);
						_this.precisePrice = price;
						_this.price = Number(price);
					}
				})

				_this.queryIsAuth(coins.USDT.contract, (result) => {
					if (result == 0) {
						_this.USDT_Auth = 0;
						return;
					}
					_this.USDT_Auth = Number(web3js.utils.fromWei(result, 'mwei'));
				})
				_this.queryIsAuth(coins.YDJ.contract, (result) => {
					if (result == 0) {
						_this.YDJ_Auth = 0;
						return;
					}
					_this.YDJ_Auth = Number(web3js.utils.fromWei(result, 'ether'));
				})

				coins.MODEL.contract.methods.earnedReward(_this.$store.state.userAddress).call((error, result) => {
					if (!error) {
						_this.userBalance.USDT_earnedReward = web3js.utils.fromWei(result, 'mwei');
						if (_this.precisePrice) {
							_this.userBalance.YDJ_earnedReward = _this.userBalance.USDT_earnedReward * _this
								.precisePrice;
						}
					}
				})
				coins.REF.contract.methods.user_team_num(_this.$store.state.userAddress).call((error, result) => {
					if (!error) {
						_this.teamNum = result;
					}
				})

				coins.MODEL.contract.methods.getNowRes(_this.$store.state.userAddress).call((error, result) => {
					if (!error) {
						result = web3js.utils.fromWei(result, 'mwei');
						result = new BigNumber(result);
						_this.last_state_usdt_num = Number(result.div(2));
					}
				})

				// 是否绑定过
				coins.REF.contract.methods.user_referrer(_this.$store.state.userAddress).call((error, result) => {
					if (!error) {
						if (result == 0) {
							_this.isBind = false;
						} else {
							_this.isBind = true;
						}
					}
				})

			},
			async addToken() {
				ethereum.request({
					method: 'wallet_watchAsset',
					params: {
						type: 'ERC20',
						options: {
							address: coins.YDJ.contract._address,
							symbol: await coins.YDJ.contract.methods.symbol().call(),
							decimals: 18,
						},
					},
				}).then((success) => {
					if (success) {
						console.log('successfully added to wallet!')
					} else {
						throw new Error('Something went wrong.')
					}
				}).catch(console.error)
			},
			openUrl(url) {
				if (url == 'ydj') {
					window.open('https://arbiscan.io/token/' + coins.YDJ.contract._address)
				} else if (url == 'main') {
					window.open('https://arbiscan.io/address/' + coins.MODEL.contract._address)
				} else if (url == 'trans'){
					window.open('https://app.camelot.exchange')
				}

			},
			showBind() {
				Bus.$emit('showBindPopup')
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
						Toast(json.message)
					} else {
						Toast(estimate.msg)
					}
					callback(false)
					return;
				}
				callback(true)
			},
		}
	};
</script>

<style lang="scss">
</style>

<style lang="scss" scoped>
	.home {
		min-height: 100vh;
		background-repeat: no-repeat;
		background-size: 100% auto;
		padding-top: 0.24rem;
		padding-bottom: 1rem;
	}

	#echarts-main {
		width: 3rem;
		height: 3rem;
		display: block;
		margin: 0 auto;
	}

	.content {
		width: 6.86rem;
		margin: 0 auto;
	}

	.statement {
		border-radius: 0.24rem;
		border: 0.02rem solid #3B3E49;
		font-size: 0.24rem;
		color: #232222A3;
		padding: 0.12rem 0.2rem;
		text-align: center;
		margin-top: 0.48rem;
	}

	.group-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0.28rem 0;

		.name {
			display: flex;
			align-items: center;

			img {
				width: 0.32rem;
				height: 0.32rem;
			}

			span {
				font-size: 0.28rem;
				margin-left: 0.16rem;
				color: #000000;
				font-weight: bold;
			}
		}

		.text {
			font-size: 0.24rem;
			color: #1D1D1DA3;
		}
		.down{
			width: 0.3rem;
			height: 0.3rem;
			display: flex;
			justify-content: center;
			align-items: center;
			img{
				width: 0.3rem;
				height: 0.3rem;
			}
		}
	}
	.push-list{
		text-align: center;
		.li{
			font-size: 0.24rem;
			color: #000;
			padding: 0.16rem 0;
		}
	}
	.echarts-box{
		position: relative;
	}
	.last-mint-sum {
		width: 3rem;
		height: 3rem;
		// background: url('../../assets/img/schedule.png') no-repeat;
		// background-size: 100% 100%;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		z-index: 99;
		margin: 0 auto;
		text-align: center;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 1rem 0;

		.sum {
			color: #000000;
			font-size: 0.32rem;
			font-weight: bold;
			width: 100%;
		}

		.text {
			color: #000000;
			opacity: 0.65;
			width: 100%;
		}
	}

	.list-pool {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 0.7rem;

		.li {
			width: 25%;

			.text {
				display: flex;
				align-items: center;
				justify-content: center;

				.color-box {
					width: 0.24rem;
					height: 0.24rem;
					background: #2679FD;
					border-radius: 0.04rem;
				}

				.green {
					background: #03C18E;
				}

				.yellow {
					background: #FF9B00;
				}

				.red {
					background: #FF3880;
				}

				span {
					font-size: 0.2rem;
					color: #000000;
					opacity: 0.65;
					margin-left: 0.08rem;
				}
			}

			.num {
				text-align: center;
				color: #000000;
				font-size: 0.24rem;
				font-weight: bold;
				margin-top: 0.08rem;
			}
		}
	}

	.mint-btn {
		padding: 0.12rem 0.24rem;
		background: #246BFD;
		min-width: 1.4rem;
		text-align: center;
		border: 0.01rem solid #68A1FF;
		color: #fff;
		font-size: 0.28rem;
		width: fit-content;
		border-radius: 1rem;
		margin: 0 auto;
		margin-top: 0.36rem;
		cursor: pointer;
	}

	.mint-btn:active {
		opacity: 0.85;
	}

	.mint-info {
		color: #443B3BA3;
		font-size: 0.24rem;
		margin-top: 0.36rem;
		text-align: center;
	}

	.input-box {
		height: 0.96rem;
		background: #fff;
		border: 0.02rem solid #E4D3D3;
		border-radius: 0.24rem;
		display: flex;
		align-items: center;
		margin-top: 0.32rem;
		justify-content: space-between;

		input {
			height: 0.7rem;
			flex: 1;
			font-size: 0.28rem;
			color: #000000;
			padding-left: 0.32rem;
		}

		.group-btn {
			width: fit-content;
			padding: 0 0.2rem;
			margin-top: 0;
			margin: 0 0;
			margin-left: 0.2rem;
		}

		.copy {
			width: 0.48rem;
			height: 0.48rem;
			margin-right: 0.32rem;
			cursor: pointer;
		}
	}



	.swap-box {
		.coin-box {
			background: #fff;
			border-radius: 0.24rem;
			padding: 0.32rem;
			border: 0.02rem solid #E4D3D3;

			.balance-top {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 0.24rem;
				color: #000;
			}

			.input-ct {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 0.24rem;

				.left {
					color: #000;
					font-weight: bold;
					font-size: 0.32rem;
					display: flex;
					align-items: center;

					span {}

					img {
						width: 0.32rem;
						height: 0.32rem;
						margin-left: 0.08rem;
					}
				}

				input {
					text-align: right;
					height: 0.64rem;
					width: 60%;
					color: #246BFD;
					font-weight: bold;
					font-size: 0.48rem;
				}
			}

			.max {
				display: flex;
				justify-content: flex-end;

				span {
					padding: 0.08rem 0;
					font-size: 0.24rem;
					color: #04CA96;
					font-weight: bold;
				}
			}
		}

		.add {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 0.32rem;

			img {
				width: 0.72rem;
				height: 0.72rem;
				display: block;
			}
		}
	}

	.info {
		padding: 0.64rem 0;

		h2 {
			font-size: 0.24rem;
			color: #333;
			opacity: 0.65;
			text-align: center;
			font-weight: normal;
		}
	}

	.group-btn {
		margin-top: 0.48rem;
	}

	.group-btn-no {
		background: #939393;
	}

	.other-btn {
		border: 0.02rem solid #68A1FF;
		color: #3682FF;
		font-weight: bold;
		padding: 0.14rem 0.24rem;
		border-radius: 1rem;
		width: fit-content;
		margin: 0 auto;
		margin-top: 0.6rem;
		cursor: pointer;
	}

	.wallet-list {
		width: 5rem;
		display: block;
		margin: 0 auto;
		margin-top: 0.8rem;
	}

	@media (min-width: 900px) {
		.content {
			width: 900px;
		}
	}
	
	
	.black{
		background: #070505;
		.statement{
			border: 0.02rem solid #3B3E49;
			color: #FFFFFFA3;
		}
		.group-title .name span{
			color: #FFFFFF;
		}
		.last-mint-sum{
			.sum{
				color: #FFFFFF;
			}
			.text{
				color: #fff;
				opacity: 0.65;
			}
		}
		.list-pool .li .text span{
			color: #FFFFFF;
			opacity: 0.65;
		}
		.list-pool .li .num{
			color: #fff;
		}
		.mint-info{
			color: #FFFFFFA3;
		}
		.group-title .text{
			color: #FFFFFFA3;
		}
		.input-box{
			background: #070505;
			border: 0.02rem solid #3B3E49;
		}
		.swap-box .coin-box{
			background: #070505;
			border: 0.02rem solid #5C5757;
		}
		.swap-box .coin-box .balance-top{
			color: #fff;
		}
		.swap-box .coin-box .input-ct .left{
			color: #fff;
		}
		.swap-box .coin-box .input-ct input{
			color: #FFD600;
		}
		.info h2{
			color: #FFFFFFA3;
		}
		.push-list .li{
			color: #FFFFFFA3;
		}
	}
</style>