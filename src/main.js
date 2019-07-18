import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
//复制到粘贴板插件
import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)
import animated from 'animate.css' 
Vue.use(animated)
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [{
		path: '/App',
		name: 'app',
		component: App
	},{
		path: '/',
		redirect: 'app'
	} //  碰到#/重定向到#/home
	]
const router = new VueRouter({
routes
})
new Vue({
	router,
  render: h => h(App),
}).$mount('#app')
