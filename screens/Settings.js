import { View, StyleSheet } from 'react-native'

import ArabicText from '../components/SettingsComponents/ArabicText';
import Translation from '../components/SettingsComponents/Translation';

const Settings = () => {

  return (
    <View style={styles.container}>
      <ArabicText />
      <Translation />
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    margin: 20, 
  },
  modelButton: {
    borderWidth: 1,
    borderBlockColor: 'black',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})