import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/Login'
import join from '@/components/Join'
import Message from '@/components/Message'
import Mypage from '@/components/MyPage'
import KakaoNick from '@/components/KakaoNick'
import calendar from '@/components/Calendar'
import kakaoMap from '@/components/kakaoMap'
Vue.use(Router)


export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'login',
            component: login
        },
        {
            path: '/join',
            name: 'join',
            component: join
        },
        {
            path: '/message',
            name: 'Message',
            component: Message
        },
        {
            path: '/mypage',
            name: 'Mypage',
            component: Mypage
        },
        {
            path: '/kakaonick',
            name: 'KakaoNick',
            component: KakaoNick
        },
        {
            path: '/calendar',
            name: 'calendar',
            component: calendar
        },
        {
            path: '/map',
            name: 'map',
            component: kakaoMap
        }
    ]
})
