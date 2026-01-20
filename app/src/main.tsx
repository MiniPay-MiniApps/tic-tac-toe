import { StrictMode } from 'react'

import { App } from '~/App.tsx'

import '~/styles/globals.css'

import ReactDOM from 'react-dom/client'

console.log(`
  ███╗   ███╗ ██╗ ███╗   ██╗ ██╗ ██████╗  █████╗   ██╗   ██╗
  ████╗ ████║ ██║ ████╗  ██║ ██║ ██╔══██╗ ██╔══██╗ ╚██╗ ██╔╝
  ██╔████╔██║ ██║ ██╔██╗ ██║ ██║ ██████╔╝ ███████║  ╚████╔╝ 
  ██║╚██╔╝██║ ██║ ██║╚██╗██║ ██║ ██╔═══╝  ██╔══██║   ╚██╔╝  
  ██║ ╚═╝ ██║ ██║ ██║ ╚████║ ██║ ██║      ██║  ██║    ██║   
  ╚═╝     ╚═╝ ╚═╝ ╚═╝  ╚═══╝ ╚═╝ ╚═╝      ╚═╝  ╚═╝    ╚═╝   
  `)

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('No root element found')
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
