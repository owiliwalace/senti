import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, useColorScheme, TouchableOpacity, Image } from 'react-native';
import { db } from '../../app/config/firebaseConfig'; // Import Firestore from your config
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { router } from 'expo-router';

const AllCategories = () => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const borderBottomColor = colorScheme === 'dark' ? 'white' : 'black';

  // Function to handle the press event
  const handlePress = (tender) => {
    router.push(`/Tender/${tender.id}`); // Navigate to the Tender screen
  };

  const [data, setData] = useState([]); // State to hold tender data
  const [usersMap, setUsersMap] = useState({}); // State to hold user data as a map

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tender documents
        const tenderCollection = collection(db, 'tender');
        const tenderSnapshot = await getDocs(tenderCollection);
        const tenderList = tenderSnapshot.docs.map(doc => ({
          id: doc.id, // Firestore document ID
          ...doc.data(), // Spread the document data
        }));

        // Fetch users documents
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id, // Firestore document ID
          ...doc.data(), // Spread the document data
        }));

        // Create a map of users by email for quick access
        const usersMap = usersList.reduce((acc, user) => {
          if (user.email) {
            acc[user.email] = user.profileImage; // Map email to profileImage
          }
          return acc;
        }, {});

        setData(tenderList); // Set the tender data state
        setUsersMap(usersMap); // Set the users map
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchData(); // Call the fetch function
  }, []);

  // Function to calculate the time left (in days and hours)
  const calculateTimeLeft = (dueDate) => {
    if (!dueDate) return '';
    
    const currentDate = new Date();
    const timeDifference = new Date(dueDate.seconds * 1000) - currentDate;

    if (timeDifference <= 0) {
      return 'Expired';
    }

    const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Calculate days
    const hoursLeft = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Calculate hours

    return `${daysLeft} day(s) ${hoursLeft} hour(s) left`;
  };

  // Define the item props for the FlatList
  const Item = ({ item }) => {
    const { tender_title, due_date, category, email } = item;
    const profileImage = usersMap[email]; // Get the profile image if email matches

    return (
      <View style={[styles.item, { borderBottomColor }]}>
        <TouchableOpacity 
          style={[{ width: '100%', display: 'flex', flexDirection: 'row', padding: 5 }]}
          onPress={() => handlePress(item)} // Pass the item to handlePress
        >
          <View style={{ width: '100%' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (  
                <Image
                  source={require('../../assets/main/extra.png')}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              )}
              <View style={{ marginLeft: profileImage ? 0 : 0 , width: '85%' }}>
                <Text style={[styles.category, { color: textColor }]}>Category: {category}</Text>
                <Text numberOfLines={1} style={[styles.title, { color: textColor }]}>{tender_title}</Text>

                <View 
                style={{display:'flex',flexDirection:'row',
                justifyContent:'space-between',
                width:'90%'}}>

                <Text style={[styles.due]}>{due_date ? new Date(due_date.seconds * 1000).toLocaleDateString() : ''}  </Text>
                <Text style={[styles.due]}>{calculateTimeLeft(due_date)} </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      
      <FlatList
        style={{ height: '100%', width: '100%',marginBottom:48 }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Item item={item} />} 
        showsVerticalScrollIndicator={false}
      />
      <View></View>
    </View>
  );
};

export default AllCategories;

const styles = StyleSheet.create({
  item: {
    padding: 0,
    paddingTop: 0,
    marginBottom: 1,
    marginTop: 0,
    width: '99%',
    marginHorizontal: '0.5%',
    borderBottomWidth: 0.25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    color: 'gray',
  }, 
  all: {
    fontSize: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    width: '100%',
  },
  due: {
    fontSize: 12,
    marginLeft: 0,
    color: 'red',
  },
  profileImage: {
    width: 55, // Set the desired width
    height: 55, // Set the desired height
    borderRadius: 50, // Make it circular if needed
    marginRight: 10, // Space between image and text
  },
});
