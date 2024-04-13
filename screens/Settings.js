import { Text, View, StyleSheet } from 'react-native'

const Settings = () => {
  return (
    <View style={styles.center}>
      <Text>This is the Settings screen</Text>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    },
})