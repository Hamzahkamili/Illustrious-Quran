import React from 'react';
import { View, Text } from 'react-native';

const Library = ({ route }) => {
  const { surah } = route.params; // Access passed surah data
  

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Surah Details:</Text>
      <Text>Number: {surah.number}</Text>
      <Text>English Name: {surah.englishName}</Text>
      <Text>Name: {surah.name}</Text>
      {/* Display other details as needed */}
    </View>
  );
};

export default Library;