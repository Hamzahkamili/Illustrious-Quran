import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

const Verses = ({ route }) => {
  const { surah } = route.params;
  const [verses, setVerses] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Fetch surah information
    const fetchSurahInfo = async () => {
      if (surah) {
        await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}`)
          .then((response) => response.json())
          .then((data) => {
            setVerses(data.data.ayahs);
            setLoading(false);
          })
          .catch((error) =>
            console.error("Error fetching verses for surah:", error)
          );
      }
    };

    // Fetch English translation
    const fetchEnglishTranslation = async () => {
      await fetch(`https://api.alquran.cloud/v1/quran/en.asad`)
        .then((response) => response.json())
        .then((data) => {
          const surahTranslation = data.data.surahs.find(
            (s) => s.number === surah.number
          );
          setTranslations(surahTranslation?.ayahs || []);
        })
        .catch((error) =>
          console.error("Error fetching English translation:", error)
        );
    };

    // Call both functions
    fetchSurahInfo();
    fetchEnglishTranslation();
  }, [surah]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headingContainer}>
        <Text>{surah.englishName}</Text>
        <Text>{surah.name}</Text>
      </View>

      {/* Display verses with translations */}
      {verses.length > 0 && (
        <FlatList
          style={styles.verseContainer}
          data={verses}
          keyExtractor={(item) => item.number.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.verseRow}>
              <Text style={styles.verseText}>{`${index + 1}. ${item.text}`}</Text>
              {translations.length > 0 && (
                <Text style={styles.translationText}>{`${translations[index]?.text}`}</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headingContainer: {
    margin: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verseContainer: {
    margin: 15,
    padding: 10,
    paddingVertical: 30,
    borderBottomWidth: 10,
    borderBottomColor: "#fceddc",
  },
  verseRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  verseText: {
    textAlign: 'right',
    flex: 1,
  },
  translationText: {
    flex: 1,
  },
});

export default Verses;
