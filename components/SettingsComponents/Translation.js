import React from 'react'
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Modal } from 'react-native'
import RadioButtonRN from 'radio-buttons-react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { addAuthor, addLanguage } from '../../store/settings';
import { useDispatch } from 'react-redux';

const Translation = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [authorsForLanguage, setAuthorsForLanguage] = useState([])
    const [translationModel, setTranslationModel] = useState(false);
    const [authorLoading, setAuthorLoading] = useState(false);
    const [languages, setLanguages] = useState([])
    const [label, setLabel] = useState([])

    useEffect(() => {
        setLoading(true);
        fetch("https://illustriousquran-backend.onrender.com/v1/scripture/quraan/info/languages")
          .then((response) => response.json())
          .then((data) => {
            // console.log(data);
            setLanguages(data.data)
            setLoading(false);
          })
          .catch((error) =>
            console.error("Error fetching Quran surah names:", error)
          );
    }, []);

    function handleTranslationPress(translation) {
        setLabel([])
        dispatch(addLanguage({id: translation}))
        setAuthorLoading(true);
        fetch("https://illustriousquran-backend.onrender.com/v1/scripture/quraan/info/authorsForLanguage?language="+translation)
          .then((response) => response.json())
          .then((data) => {
            // console.log(data.data);
            setAuthorsForLanguage(data.data)
            data.data.map((item) => {
              setLabel(prev => [...prev, {label: item._id}])
            })
            setAuthorLoading(false)
          })
          .catch((error) =>
            console.error("Error fetching Quran surah names:", error)
          );
        setTranslationModel(true);
    }

    if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#795547" />
          </View>
        );
    }

    function handleRadioClick(e) {
      // console.log(e);
      dispatch(addAuthor({id: e.label}))
    }

    return <>
      <View style={{marginVertical: 5}}>
      <Text>Translations: </Text>
        <FlatList
          data={languages}
          renderItem={({item}) => {
            return <TouchableOpacity onPress={(e) => handleTranslationPress(item._id)} style={[styles.modelButton, {marginVertical: 5}]}><Text>{item._id}</Text></TouchableOpacity>
          }}
        />
        <Modal visible={translationModel} animationType='slide' presentationStyle='pageSheet'>
          {!authorLoading ? <>
            <TouchableOpacity style={{marginTop: 15, marginLeft: 380}} onPress={(e) => setTranslationModel(false)}>
              <Ionicons name="close-sharp" size={25} color="#795547" />
            </TouchableOpacity>
            <View style={{padding: 20}}>
              {/* <FlatList
                data={authorsForLanguage}
                renderItem={({item}) => {
                  return <TouchableOpacity style={[styles.modelButton, {marginVertical: 5}]}><Text>{item._id}</Text></TouchableOpacity>
                }}
              /> */}
              <RadioButtonRN
                data={label}
                selectedBtn={(e) => handleRadioClick(e)}
              />
            </View>
            </> : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#795547" />
            </View>
          )}
        </Modal>
      </View>
    </>
}

export default Translation

const styles = StyleSheet.create({
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