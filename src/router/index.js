import Vue from 'vue'
import Router from 'vue-router'
import Dash from '@/components/Dash'
import Comms from '@/components/Comms'
import Navigation from '@/components/Navigation'
import Energy from '@/components/Energy'
import Payload from '@/components/Payload'
import About from '@/components/Misc/About'
import Docs from '@/components/Misc/Docs'
import Donate from '@/components/Misc/Donate'
import SettingsIndex from '@/components/Settings/SettingsIndex'
import SettingsProfile from '@/components/Settings/SettingsProfile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Dash
    },
    {
      path: '/comms',
      name: 'Communications',
      component: Comms
    },
    {
      path: '/navigation',
      name: 'Navigation',
      component: Navigation
    },
    {
      path: '/energy',
      name: 'Energy',
      component: Energy
    },
    {
      path: '/payload',
      name: 'Payload',
      component: Payload
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsIndex
    },
    {
      path: '/settings/profile',
      name: 'Your Profile',
      component: SettingsProfile
    },
    {
      path: '/docs',
      name: 'Documentation',
      component: Docs
    },
    {
      path: '/donate',
      name: 'Donate',
      component: Donate
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
