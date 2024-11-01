import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image, useColorScheme } from 'react-native';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { app } from '../config/firebaseConfig';

// Sample data for categories
const data = [
  { id: '1', title: 'Health', icon: 'rocket', image: require('../../assets/main/image1.jpeg') },
  { id: '2', title: 'Education', icon: 'coffee', image: require('../../assets/main/image2.jpeg') },
  { id: '3', title: 'COUNTY', icon: 'apple', image: require('../../assets/main/image3.jpeg') },
  { id: '4', title: 'Transport', icon: 'android', image: require('../../assets/main/image4.jpeg') },
  { id: '5', title: 'Institutional', icon: 'car', image: require('../../assets/main/image3.jpeg') },
  { id: '6', title: 'Construction', icon: 'bicycle', image: require('../../assets/main/image6.jpeg') },
  { id: '7', title: 'Farming', icon: 'camera', image: require('../../assets/main/image7.jpeg') },
];

const CategoryScreen = () => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const backgroundColor = colorScheme === 'dark' ? 'black' : 'white';
  const { id } = useLocalSearchParams();
  const [tenders, setTenders] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState('');
  const firestore = getFirestore(app);

  useEffect(() => {
    const selectedCategory = data.find(item => item.id === id);
    if (selectedCategory) {
      setCategoryTitle(selectedCategory.title);
      fetchTenders(selectedCategory.title);
    }
  }, [id]);

  const fetchTenders = async (categoryTitle) => {
    const tendersQuery = query(
      collection(firestore, 'tender'),
      where('category', '==', categoryTitle)
    );
    const querySnapshot = await getDocs(tendersQuery);
    const fetchedTenders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTenders(fetchedTenders);
  };

  const handlePress = (tender) => {
    router.push(`/Tender/${tender.id}`);
  };

  const calculateTimeLeft = (dueDate) => {
    if (!dueDate) return '';
    const currentDate = new Date();
    const timeDifference = new Date(dueDate.seconds * 1000) - currentDate;

    if (timeDifference <= 0) {
      return 'Expired';
    }

    const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${daysLeft} day(s) ${hoursLeft} hour(s) left`;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      style={{ elevation: 3, marginBottom: 2, width: '96%', marginVertical: '2%', alignSelf: 'center' }}
    >
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <View style={styles.heroContainer}>
          <Image
            source={item.profile ? { uri: item.profile } : require('../../assets/main/extra.png')}
            style={styles.heroimage}
            resizeMode="cover"
          />
        </View>
        <View style={{
          padding: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
          width: '90%',
        }}>
          <Text style={{ color: textColor }}>Category: {item.category} </Text>
          <Text numberOfLines={1} style={{ color: textColor, width: '90%' }}>{item.tender_title} </Text>
          <View  style={{display:'flex',flexDirection:'row', justifyContent:'space-between', width:'95%'}}>

          <Text style={styles.due}>Due: {item.due_date ? new Date(item.due_date.seconds * 1000).toLocaleDateString() : ''} </Text>
          <Text style={styles.due}>{calculateTimeLeft(item.due_date)} </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ height: '100%',backgroundColor:backgroundColor }}>
      <Stack.Screen
        options={{
          title: categoryTitle
        }}
      />
      <View style={styles.container}>
        {tenders.length > 0 ? (
          <FlatList
            data={tenders}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text style={[styles.noData, { color: textColor }]}>No tenders found for this category.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
  },
  heroContainer: {
    width: 55,
    height: 55,
    overflow: 'hidden',
    marginBottom: 5,
    borderRadius: 55,
  },
  heroimage: {
    width: '100%',
    height: '100%',
  },
  due: {
    fontSize: 12,
    color: 'red',
  },
});

export default CategoryScreen;
