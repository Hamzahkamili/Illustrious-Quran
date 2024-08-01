import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DisplayCard from '../ui/DisplayCard';
import ArabicText from '../components/SettingsComponents/ArabicText';
import Translation from '../components/SettingsComponents/Translation';
import Slider from '@react-native-community/slider';
import { addFontSize } from '../store/settingsSlice';
import { Button } from 'react-native-paper';
import * as SQLite from 'expo-sqlite';
import { NativeModules } from 'react-native';

const Settings = () => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.settings.language);
  const author = useSelector(state => state.settings.author);
  const arabicText = useSelector(state => state.settings.arabicText);
  const fontSize = useSelector(state => state.settings.fontSize);
  const [loadingStatus, setLoadingStatus] = useState(0)
  const [loading, setLoading] = useState();
  const [allSurahsData, setAllSurahsData] = useState([]);

  const [textStyle, setTextStyle] = useState([{ "label": "simpleClean" }, { "label": "uthmani" }, { "label": "simplePlain" }, { "label": "simple" }, { "label": "uthmaniMinimal" }, { "label": "simpleMinimal" }]);
  const [languages, setLanguages] = useState([{ "_id": "en" }, { "_id": "fr" }, { "_id": "hi" }, { "_id": "ur" }]);
  const [languagePdfs, setlanguagePdfs] = useState([{ "_id": "km" }, { "_id": "gj" }]);
  const [authors, setAuthors] = useState({ en: [{ "label": "pickthall" }, { "label": "wahiduddin" }, { "label": "Ahmed Raza" }, { "label": "arberry" }, { "label": "sarwar" }, { "label": "hilali" }, { "label": "Ahmed Ali" }, { "label": "qaribullah" }, { "label": "mubarakpuri" }, { "label": "qarai" }, { "label": "itani" }, { "label": "shakir" }, { "label": "daryabadi" }, { "label": "sahih" }, { "label": "muadudi" }, { "label": "yusufali" }], fr: [{ "label": "web" }], hi: [{ "label": "farooq" }, { "label": "web" }], ur: [{ "label": "maududi" }, { "label": "junagarhi" }, { "label": "qadri" }, { "label": "web" }, { "label": "ahmed raza" }, { "label": "najafi" }, { "label": "ahmed ali" }, { "label": "jawadi" }, { "label": "jalandhry" }] });

  const initDB = async () => {
    const db = await SQLite.openDatabaseAsync('surahs.db', {
      useNewConnection: true
    });
    return db;
  }

  const saveAllSurahsDataToDB = async (db, allSurahsData) => {
    const jsonString = JSON.stringify(allSurahsData);
    await db.runAsync('DELETE FROM surah_data');
    await db.runAsync('INSERT INTO surah_data (data) VALUES (?)', [jsonString]);
  }

  const fetchAllSurahsDataFromDB = async (db) => {
    const allRows = await db.getAllAsync('SELECT data FROM surah_data LIMIT 1');
    if (allRows.length > 0) {
      const jsonString = allRows[0].data;
      const parsedData = JSON.parse(jsonString);
      return parsedData;
    }
    return [];
  }

  const fetchAllSurahsData = async () => {
    console.log("Fetching all Surahs data");
    setLoading(true);

    const allSurahsData = [];
    for (let chapter = 1; chapter <= 114; chapter++) {
      try {
        const response = await fetch(`https://illustriousquran-backend.onrender.com/v1/scripture/quraan/search/${chapter}`);
        const data = await response.json();
        if (data?.data) {
          data.data.sort((a, b) => a.verse - b.verse);
          console.log(`Chapter ${chapter}`);
          allSurahsData.push({ chapter, verses: data.data });
        }
      } catch (error) {
        console.error(`Error fetching data for chapter ${chapter}:`, error);
      }
      setLoadingStatus(parseInt(chapter / 114 * 100))
    }
    setLoading(false);
    return allSurahsData;
  };

  async function downloadHandler() {
    const db = await initDB();
    const fetchedAllSurahsData = await fetchAllSurahsData();
    await saveAllSurahsDataToDB(db, fetchedAllSurahsData);
    Alert.alert('Downloaded', 'All Surahs data downloaded successfully. Please restart the app to see the changes.', [{ text: 'Okay', onPress: () => NativeModules.DevSettings.reload() }])
  }

  useEffect(() => {
    console.log('useEffect...');
    async function fetchDataFromDBbase() {
      const db = await initDB();
      const data = await fetchAllSurahsDataFromDB(db);
      setAllSurahsData(data);
    }
    fetchDataFromDBbase();
  }, [])

  // console.log("allSurahsData: ", allSurahsData);
  // console.log("loadingStatus: ", loadingStatus);
  // console.log("loading: ", loading);

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

          <Button disabled={loading || allSurahsData.length > 0 ? true : false} style={{marginTop: 5 ,marginBottom: 15, borderRadius: 0}} buttonColor="#3B1A74" mode="contained" onPress={downloadHandler}>
            {loading ? loadingStatus+" %" : allSurahsData.length > 0 ? 'Resouce Downloaded' : 'Download Resources'}
          </Button>

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
                onValueChange={(value) => dispatch(addFontSize({ id: value }))}
                minimumTrackTintColor="#3B1A74"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#3B1A74"
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
    padding: 15,
    backgroundColor: 'white'
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
