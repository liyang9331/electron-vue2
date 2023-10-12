import row from './row'
import col from './col'
import button from './button'
import input from './input'
const ruleList = {
  [row.name]: row,
  [col.name]: col,
  [button.name]: button,
  [input.name]: input
}

export default ruleList

