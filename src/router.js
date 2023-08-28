import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import home from './components/pages/home.vue'


const routerEnv = (process.env.NODE_ENV === 'development') ? '*' : '';

Vue.use(Router)

export default new Router({
	// mode: 'history',
	mode: 'hash',
	routes: [
		{
			path: '',
			name: 'home',
			component: Home,
			children: [
				{
					path: '/',
					name: '0',
					component: home,
				},
			],
			meta: {
				index: 5,
			}
		},
	]
})
