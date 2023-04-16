import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)

const modules = import.meta.glob('./components/**.vue', { eager: true })

Object.keys(modules).forEach((key: string) => {
  const module = modules[key] as any
  app.component(module.default.__name, module.default)
})

app.mount('#app')
