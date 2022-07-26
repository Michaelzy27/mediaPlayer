import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './App'
import './index.css'
import { HashRouter } from 'react-router-dom';

console.log('DEBUG')

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <HashRouter>
    <App />
  </HashRouter>,
)

const showErrorOverlay = (err: any) => {
  // must be within function call because that's when the element is defined for sure.
  const ErrorOverlay = customElements.get('vite-error-overlay')
  // don't open outside vite environment
  if (!ErrorOverlay) {return}
  console.error('ERROR', err)
  const overlay = err.error?.message ? new ErrorOverlay(err.error)
    : err.message ? new ErrorOverlay(err)
    : err.info ? new ErrorOverlay({message: err.info})
    : new ErrorOverlay({message: err.toString()});
  document.body.appendChild(overlay)
}

window.addEventListener('error', showErrorOverlay)
window.addEventListener('unhandledrejection', ({reason}) => showErrorOverlay(reason))