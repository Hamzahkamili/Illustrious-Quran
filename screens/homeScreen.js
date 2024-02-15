import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';

const QuranScreen = () => {
  const [surahs, setSurahs] = useState([]);

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(response => response.json())
      .then(data => {
        setSurahs(data.data);
      })
      .catch(error => console.error('Error fetching Quran surah names:', error));
  }, []);

  const handleSurahPress = (surah) => {
    // Add your logic when a surah is pressed
    console.log(`Surah ${surah.number} is pressed`);
  };

  return (
    <View style={styles.container}>
     
      <FlatList
        data={surahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleSurahPress(item)} style={styles.surahItem}>
            <Text>{`${item.number}. ${item.englishName} - ${item.name}`}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  surahItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default QuranScreen;
