import { SafeAreaView, StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Image, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { db } from '@/app/config/firebaseConfig'; 
import { collection, getDocs } from 'firebase/firestore';

const Search = () => {
  const [tenders, setTenders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTenders, setFilteredTenders] = useState([]);
  const [usersMap, setUsersMap] = useState({}); 
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const bgColor = colorScheme === 'dark' ? 'black' : 'white';

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tender'));
        const tenderList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTenders(tenderList); 
        setFilteredTenders(tenderList); 
      } catch (error) {
        console.error('Error fetching tenders: ', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Create a map of users by email for quick access
        const userMap = usersList.reduce((acc, user) => {
          if (user.email) {
            acc[user.email] = user.profileImage; // Map email to profileImage
          }
          return acc;
        }, {});

        setUsersMap(userMap); // Set the users map
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchTenders();
    fetchUsers();
  }, []);

  // Function to handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = tenders.filter(tender => 
        (tender.category && tender.category.toLowerCase().includes(query.toLowerCase())) ||
        (tender.eligibility && tender.eligibility.toLowerCase().includes(query.toLowerCase())) ||
        (tender.ward && tender.ward.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredTenders(filtered);
    } else {
      setFilteredTenders(tenders); 
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor:bgColor}]}>
      <Stack.Screen
        options={{
          title: 'Search Tenders',
        }}
      />
      <TextInput
        style={[styles.searchInput,{ color: textColor }]}
        placeholder='Search by category, eligibility, or county...'
        placeholderTextColor={textColor} 
        value={searchQuery}
        onChangeText={handleSearch}
        autoCorrect={false}
      />
      <FlatList
        data={filteredTenders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const profileImage = usersMap[item.email]; 
          return (
            <TouchableOpacity style={styles.tenderItem}>
              <View style={{display:'flex',flexDirection:'row',gap:5}}>

              {profileImage ? (
                <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
                resizeMode="cover"
                />
              ) : (  
                <Image
                source={require('@/assets/main/extra.png')}
                style={styles.profileImage}
                resizeMode="cover"
                />
              )}
              <View style={{width:'88%'}}>

              <Text style={[styles.tenderDetail,{ color: textColor }]}>Category: {item.category ? item.category: 'N/A'}</Text>
              <Text numberOfLines={1} 
              style={[styles.tenderDetail,{ color: textColor }]}>{item.tender_title ? item.tender_title:'N/A'}</Text>
              <Text style={[styles.tenderDetail,{ color: textColor }]}>Eligibility: {item.eligibility ? item.eligibility: 'N/A'}</Text>
              <Text style={[styles.tenderDetail,{ color: textColor }]}>County: {item.ward ? item.ward: "N/A"}</Text>
              </View>
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    padding: 16,
    paddingTop:3,
    height:'100%'
    
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 4,
    
  },
  listContainer: {
    paddingBottom: 20,
  },
  tenderItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom:2,
    paddingTop:7
  },
  tenderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tenderDetail: {
    fontSize: 14,
   
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginVertical: 10,
  },
});
