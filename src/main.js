import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
	PullRefresh
} from 'vant';
import 'vant/lib/index.css';
import './common/font/font.css';
import VueCookies from 'vue-cookies'
import VueClipboard from 'vue-clipboard2'
import VueI18n from 'vue-i18n';
import echarts from 'echarts'

import axios from 'axios';

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';

Vue.use(VueClipboard)
Vue.use(VueCookies)
Vue.use(PullRefresh);
Vue.use(VueI18n);
Vue.config.productionTip = false
Vue.use(VueToast, {
  position: 'top'
})
Vue.prototype.$echarts = echarts

// import Vconsole from 'vconsole'

// let vConsole = new Vconsole()
// export default vConsole

const i18n = new VueI18n({
	locale: 'en-US',
	messages: {
		'en-US': require('./common/lang/en'),
		'zh-CN': require('./common/lang/zh-cn'),
	}
})

const mainVue = new Vue({
	i18n,
	router,
	store,
	render: h => h(App)
}).$mount('#app')