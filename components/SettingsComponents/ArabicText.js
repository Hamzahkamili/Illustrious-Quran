import React, { useEffect, useState } from 'react'

import { Text, View, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native'
import RadioButtonRN from 'radio-buttons-react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch } from "react-redux"
import { addArabicText } from '../../store/settings'

const ArabicText = () => {
    const dispatch = useDispatch();
    const [textModelOpen, settextModelOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [arabicText, setArabicText] = useState([])
    const [label, setLabel] = useState([])

    useEffect(() => {
      setLoading(true);
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
          console.error("Error fetching Quran surah names:", error)
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
    }

    return <>
      <View style={{marginVertical: 5}}>
        <TouchableOpacity style={styles.modelButton} onPress={(e) => settextModelOpen(true)}>
          <Text>Arabic Text Style</Text> 
        </TouchableOpacity>
        <Modal visible={textModelOpen} animationType='slide' presentationStyle='pageSheet'>
          <TouchableOpacity style={{marginTop: 15, marginLeft: 380}} onPress={(e) => settextModelOpen(false)}>
            <Ionicons name="close-sharp" size={25} color="#795547" />
          </TouchableOpacity>
  
          <View style={{padding: 20}}>
            <RadioButtonRN
              data={label}
              selectedBtn={(e) => handleRadioClick(e)}
            />
          </View>
        </Modal>
      </View>
    </>
}

export default ArabicText

const styles = StyleSheet.create({
    modelButton: {
      borderWidth: 1,
      borderBlockColor: 'black',
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 10,
    },
})