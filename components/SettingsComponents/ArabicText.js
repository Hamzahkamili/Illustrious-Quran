import React, { useEffect, useState } from 'react'

import { Text, View, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native'
import RadioButtonRN from 'radio-buttons-react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch } from "react-redux"
import { addArabicText } from '../../store/settingsSlice'
import { ScrollView } from 'react-native-gesture-handler';

const ArabicText = () => {
    const dispatch = useDispatch();
    const [textModelOpen, settextModelOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [arabicText, setArabicText] = useState([])
    const [label, setLabel] = useState([])

    useEffect(() => {
      setLabel([])
      setLoading(true);
      // fetch("http://192.168.29.253:3000/v1/scripture/quraan/info/arabicText")
      fetch("https://illustriousquran-backend.onrender.com/v1/scripture/quraan/info/arabicText")
        .then((response) => response.json())
        .then((data) => {
          // console.log(data.data);
          setArabicText(data.data)
          data.data.map((item) => {
            setLabel(prev => [...prev, {label: item._id}])
          })
          setLoading(false);
        })
        .catch((error) =>
          console.error("Error fetching Quran arabic text:", error)
        );
    setLoading(false);
    }, []);

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#795547" />
        </View>
      );
    }

    // console.log(label);

    function handleRadioClick(e) {
      // console.log(e);
      dispatch(addArabicText({id: e.label}))
      settextModelOpen(false)
    }

    return <>
      <View style={{marginVertical: 5}}>
        <Text>Styles:</Text> 
        <TouchableOpacity style={styles.modelButton} onPress={(e) => settextModelOpen(true)}>
          <Text style={styles.text}>Arabic Text Style</Text> 
        </TouchableOpacity>
        <Modal visible={textModelOpen} animationType='slide' presentationStyle='pageSheet'>
          <TouchableOpacity style={{marginTop: 15, marginLeft: 380}} onPress={(e) => settextModelOpen(false)}>
            <Ionicons name="close-sharp" size={25} color="#795547" />
          </TouchableOpacity>
  
          <ScrollView style={{padding: 20}}>
            <RadioButtonRN
              data={label}
              selectedBtn={(e) => handleRadioClick(e)}
            />
          </ScrollView>
        </Modal>
      </View>
    </>
}

export default ArabicText

const styles = StyleSheet.create({
    modelButton: {
      borderWidth: 3,
      borderColor: '#D7A86E',
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 5,
      marginTop: 5,
    },
    text: {
      color: '#795547',
      fontSize: 18,
    },
})