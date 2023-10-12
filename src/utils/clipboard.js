import Clipboard from 'clipboard'
import { ElMessage } from 'element-ui'
function clipboardSuccess () {
  ElMessage.success('复制完成！')
}

function clipboardError () {
  ElMessage.error('复制失败！')
}

export default function handleClipboard (text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess()
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
