import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const Planner = ({ navigation }) => {
  const [dummyItems, setDummyItems] = useState([
    { id: 1, title: 'Item 1' },
    { id: 2, title: 'Item 2' },
    { id: 3, title: 'Item 3' },
    // Add more dummy items as needed
  ]);

  const handleItemPress = (item) => {
    navigation.navigate('Library', { item }); // Pass item data
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={dummyItems}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <Text style={{ fontSize: 18 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default Planner;
