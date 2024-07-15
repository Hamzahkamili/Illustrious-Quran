import { View, StyleSheet } from 'react-native'

import ArabicText from '../components/SettingsComponents/ArabicText';
import Translation from '../components/SettingsComponents/Translation';
import { useEffect, useState } from 'react';

const Settings = () => {
  const [textStyle, setTextStyle] = useState([{ "label": "simpleClean" }, { "label": "uthmani" }, { "label": "simplePlain" }, { "label": "simple" }, { "label": "uthmaniMinimal" }, { "label": "simpleMinimal" }])
  const [languages, setLanguages] = useState([{ "_id": "en" }, { "_id": "fr" }, { "_id": "hi" }, { "_id": "ur" }])
  const [authors, setAuthors] = useState({ en: [{ "label": "pickthall" }, { "label": "wahiduddin" }, { "label": "Ahmed Raza" }, { "label": "arberry" }, { "label": "sarwar" }, { "label": "hilali" }, { "label": "Ahmed Ali" }, { "label": "qaribullah" }, { "label": "mubarakpuri" }, { "label": "qarai" }, { "label": "itani" }, { "label": "shakir" }, { "label": "daryabadi" }, { "label": "sahih" }, { "label": "muadudi" }, { "label": "yusufali" }], fr: [{ "label": "web" }], hi: [{ "label": "farooq" }, { "label": "web" }], ur: [{ "label": "maududi" }, { "label": "junagarhi" }, { "label": "qadri" }, { "label": "web" }, { "label": "ahmed raza" }, { "label": "najafi" }, { "label": "ahmed ali" }, { "label": "jawadi" }, { "label": "jalandhry" }] })

  return (
    <View style={styles.container}>
      <ArabicText textStyle={textStyle} />
      <Translation languages={languages} authors={authors}/>
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