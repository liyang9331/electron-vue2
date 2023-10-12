import { createApp } from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
const app = createApp({})
app.component('SvgIcon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
