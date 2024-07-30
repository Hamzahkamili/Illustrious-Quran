import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DisplayCard from '../ui/DisplayCard';
import ArabicText from '../components/SettingsComponents/ArabicText';
import Translation from '../components/SettingsComponents/Translation';
import Slider from '@react-native-community/slider';
import { addFontSize } from '../store/settingsSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.settings.language);
  const author = useSelector(state => state.settings.author);
  const arabicText = useSelector(state => state.settings.arabicText);
  const fontSize = useSelector(state => state.settings.fontSize);


  const [textStyle, setTextStyle] = useState([{ "label": "simpleClean" }, { "label": "uthmani" }, { "label": "simplePlain" }, { "label": "simple" }, { "label": "uthmaniMinimal" }, { "label": "simpleMinimal" }]);
  const [languages, setLanguages] = useState([{ "_id": "en" }, { "_id": "fr" }, { "_id": "hi" }, { "_id": "ur" }]);
  const [languagePdfs, setlanguagePdfs] = useState([{ "_id": "km" }, { "_id": "gj" }]);
  const [authors, setAuthors] = useState({ en: [{ "label": "pickthall" }, { "label": "wahiduddin" }, { "label": "Ahmed Raza" }, { "label": "arberry" }, { "label": "sarwar" }, { "label": "hilali" }, { "label": "Ahmed Ali" }, { "label": "qaribullah" }, { "label": "mubarakpuri" }, { "label": "qarai" }, { "label": "itani" }, { "label": "shakir" }, { "label": "daryabadi" }, { "label": "sahih" }, { "label": "muadudi" }, { "label": "yusufali" }], fr: [{ "label": "web" }], hi: [{ "label": "farooq" }, { "label": "web" }], ur: [{ "label": "maududi" }, { "label": "junagarhi" }, { "label": "qadri" }, { "label": "web" }, { "label": "ahmed raza" }, { "label": "najafi" }, { "label": "ahmed ali" }, { "label": "jawadi" }, { "label": "jalandhry" }] });

  function handleSliderChange(value) {
    dispatch(addFontSize({ id: value }));
  }

  return (
    <FlatList showsVerticalScrollIndicator={false} style={styles.container}
      data={[1]}
      keyExtractor={item => item}
      renderItem={({ item }) => (
        <View>
          <View style={styles.preferencsContainer}>
            <View style={styles.line} />
            <Text style={styles.preferenceText}>Current Preferences</Text>
            <View style={styles.line} />
          </View>
          <View style={styles.row1}>
            <DisplayCard title="Language" value={language} />
            <DisplayCard title="Author" value={author} />
          </View>
          <View style={styles.row1}>
            <DisplayCard title="Arabic Text Style" value={arabicText} />
            <DisplayCard title="Font Size" value={fontSize} />
          </View>

          <View style={styles.preferencsContainer}>
            <View style={styles.line} />
            <Text style={styles.preferenceText}>Select Preferences</Text>
            <View style={styles.line} />
          </View>
          
          <Text style={styles.header}>Styles / Font Size:</Text>
          <View style={styles.row2}>
            <ArabicText textStyle={textStyle} />
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={15}
                maximumValue={35}
                step={1}
                value={fontSize}
                onValueChange={handleSliderChange}
                minimumTrackTintColor="#1FB28A"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#1FB28A"
              />
            </View>
          </View>

          <Text style={styles.header}>Translations:</Text>
          <Translation languages={languages} authors={authors} />

          <View style={[styles.preferencsContainer, { justifyContent: 'center' }]}>
            <View style={[styles.line, { flex: 0.3 }]} />
            <Text style={styles.preferenceText}>Available PDF's</Text>
            <View style={[styles.line, { flex: 0.3 }]} />
          </View>

          <Translation languages={languagePdfs} authors={authors} />
        </View>
    )}
  />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    gap: 5
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  preferencsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  line: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#333',
  },
  preferenceText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 10,
  },
  header: {
    fontSize: 18,
    color: '#333',
    marginVertical: 8,
    fontStyle: 'italic',
  },
  sliderContainer: {
    flex: 1,
  },
  sliderLabel: {
    fontSize: 16,
    color: '#333',
  },
  slider: {
    height: 40,
  },
});

export default Settings;
