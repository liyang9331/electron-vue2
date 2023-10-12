import { ElLoading } from 'element-ui'

let loading

function startLoading (el, text) {
  loading = ElLoading.service({
    lock: true,
    text: text,
    background: 'rgba(0, 0, 0, 0.7)',
    target: document.querySelector(el)
  })
}

function endLoading () {
  loading.close()
}

export {
  startLoading,
  endLoading
}
