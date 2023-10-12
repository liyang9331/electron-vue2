const getters = {
  device: state => state.app.device,
  wpId: state => state.settings.wpId,
  historyDbLink: state => state.settings.historyDbLink,
  titleType: state => state.settings.titleType,
  encryptionArr: state => state.settings.encryptionArr,
  encryptionValue: state => state.settings.encryptionValue

}
export default getters
