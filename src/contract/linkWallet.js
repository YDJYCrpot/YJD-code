import Web3 from 'web3'

import {
	coin
} from './abi.js'

// web3
function getWeb3(callback){
	var web3 = window.web3;
	if (window.ethereum) {
		callback(new Web3(ethereum));
		return;
	}
	if (typeof web3 !== 'undefined') {
		callback(new Web3(web3.currentProvider));
		return;
	}
	callback(false)
}

async function linkWallet(callback){
    if (typeof window.ethereum !== 'undefined') {
        let addr = await ethereum.request({ method: 'eth_requestAccounts' }); //appove account
		// init web3
		getWeb3((web3js)=>{
			if(web3js == false){
				callback(false,-1,'')
				return;
			}
			window.web3js = web3js;
			
			let c = coin
			// console.log(c);
			if(ethereum.chainId == 42161){
				c.YDJ.contract = new web3js.eth.Contract(coin.YDJ.abi, coin.YDJ.address);
				c.USDT.contract = new web3js.eth.Contract(coin.USDT.abi, coin.USDT.address);
				c.REF.contract = new web3js.eth.Contract(coin.REF.abi, coin.REF.address);
				c.MODEL.contract = new web3js.eth.Contract(coin.MODEL.abi, coin.MODEL.address);
				c.camelotRouter.contract = new web3js.eth.Contract(coin.camelotRouter.abi, coin.camelotRouter.address);
			}
			
			window.coins = c;
			
			// linsten account
			ethereum.on("accountsChanged", function(accounts) {
				window.location.reload();
			});
			ethereum.on("chainChanged",()=>{
				window.location.reload();
			});
			
			callback(true,Number(ethereum.chainId),addr[0])
		})
    }else{
		callback(false,-1,'')
    }
}





export {
	linkWallet
}
