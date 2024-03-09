import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

const Verses = ({ route }) => {
  const { surah } = route.params; // Access passed surah data
  const [verses, setVerses] = useState([]);
  const [loading,setLoading] = useState(false);

  // console.log(surah);

  useEffect(() => {
    setLoading(true);
    const surahInfo = async () => {
      if (surah) {
        await fetch(
          `https://api.alquran.cloud/v1/surah/${surah?.number}`
        )
          .then((response) => response.json())
          .then((data) => {
            setVerses(data.data.ayahs);
            setLoading(false);
            // console.log(data?.data?.ayahs);
          })
          .catch((error) =>
            console.error("Error fetching verses for surah:", error)
          );
      }
    };
    surahInfo();
  }, [surah]);
  
  return (
    <View  style={styles.background}>
      <View style={styles.headingContainer}>
        <Text>{surah.englishName}</Text>
        <Text>{surah.name}</Text>
      </View>

      {(surah && !loading )&&(
          <FlatList
            style={styles.verseContainer}
            data={verses}
            keyExtractor={(item) => item.number.toString()}
            renderItem={({ item }) => (
                <Text style={styles.verseText}>{`${item.number}. ${item.text}`}</Text>
            )}
          />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fffaf5',
  },
  headingContainer: {
    backgroundColor: '#FBEDDC',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verseContainer: {
    margin: 15,
  },
  verseText: {
    textAlign: 'right',
  }
});

export default Verses;