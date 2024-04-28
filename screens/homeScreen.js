import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, Modal, Image, TouchableOpacity } from "react-native";

import mosque from '../assets/mosque.png';

const HomeScreen = ({ navigation }) => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("https://illustriousquran-backend.onrender.com/v1/scripture/chapterMetaData/all")
      .then((response) => response.json())
      .then((data) => {
        data?.data.sort((a, b) => a.chapter - b.chapter); 
        setSurahs(data?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Quran surah names:", error)
        setLoading(false)
      });
  }, []);

  const handleSurahPress = (surah) => {
    navigation.navigate('Verses', { surah });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#795547" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal visible={open} animationType="none">
        <View style={styles.modelContainer}>
            <View>
                <Text style={styles.title}>Illustrious Quran</Text>
                <Text style={styles.subtitle}>Learn quran and</Text>
                <Text style={styles.subtitle}>recite once everyday</Text>
            </View>
            <View style={{alignItems: 'center'}}>
                <Image source={mosque} />
                <TouchableOpacity style={styles.button} onPress={() => setOpen(false)}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
      <FlatList
        data={surahs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSurahPress(item)}
          
          >
            {/* <Text style={styles.surahItem}>{`${item.chapter}. ${item.name} - ${item.arabicName}`}</Text> */}
            <View style={styles.surahContainer}>
                <View style={styles.innerContainer}>
                  <View style={styles.numberContainer}>
                    <Text style={styles.surahItem}>{item.chapter}</Text>
                  </View>
                  <View>
                    <Text style={styles.surahItem}>{item.name}</Text>
                    <Text style={styles.surahDescription}>{item.totalVerses} Verses | {item.revelationPlace}</Text>
                  </View>
                </View>
                <Text style={styles.surahItem} >{item.arabicName}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#795547',
  },
  subtitle: {
    fontSize: 16,
    color: '#795547',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#795547',
    paddingVertical: 15,
    width: 150,
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 9,
    backgroundColor: "#fffaf5",
    paddingHorizontal: 10,
  },
  surahContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  numberContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#fceddc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#fceddc",
    color: '#795547',
  },
  surahDescription: {
    color: '#D7A86E',
    fontSize: 12,
  }
});

export default HomeScreen;
