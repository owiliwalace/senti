import React from 'react';
import { FlatList, View, Text, Image, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import DATA, { ItemData } from '../../app/data/data'; // Import data and types
import { router } from 'expo-router';

const data = [
  { id: '1', title: 'Health', icon: 'rocket', image: require('../../assets/main/image1.jpeg') },
  { id: '2', title: 'Education', icon: 'coffee', image: require('../../assets/main/image2.jpeg') },
  { id: '3', title: 'COUNTY', icon: 'apple', image: require('../../assets/main/image3.jpeg') },
  { id: '4', title: 'Transport', icon: 'android', image: require('../../assets/main/image4.jpeg') },
  { id: '5', title: 'Institutional', icon: 'car', image: require('../../assets/main/image3.jpeg') },
  { id: '6', title: 'Construction', icon: 'bicycle', image: require('../../assets/main/image6.jpeg') },
  { id: '7', title: 'Farming', icon: 'camera', image: require('../../assets/main/image7.jpeg') },
];

const MainCategories = () => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const backgroundColor = colorScheme === 'dark' ? '' : '';

  const renderItem = ({ item }) => (

    <View style={{ marginRight: 9,height:150,marginBottom:0,marginTop:5,marginLeft:5 }}>
      <TouchableOpacity
       onPress={() => router.push(`/MainBranch/${item.id}`)} 
      
        style={{ width: 300, height: 140, position: 'relative',borderRadius:5 }}>
       
        <Image source={item.image} style={{ width: 300, height: 140,borderRadius:7, }} />
        <View style={{ position: 'absolute', top: 60, left: 0, right: 0, bottom:0, padding: 13,
          borderBottomRightRadius:7, backgroundColor: 'rgba(0, 0, 0, 0.5)',
           borderBottomLeftRadius:7,
           }}>
      
          <Text style={{ color: '#fff', fontSize: 16,top: 30, fontWeight: 'bold' }}>{item.title}</Text>
        
        </View>
      </TouchableOpacity>
    </View>
  );

 
  return (
    <View style={[styles.container]}>
      
      <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      //contentContainerStyle={styles.list}
      horizontal
      showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default MainCategories;

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  item: {
    flexDirection: 'row',
    padding: 0,
    paddingTop: 0,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    marginLeft: 10,
  },
  image: {
    width: 300,
    height: 150,
    borderRadius: 7,
  },
});
