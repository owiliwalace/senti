import { StyleSheet, Text, View, FlatList, Image, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../app/config/firebaseConfig'; 

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const colorScheme = useColorScheme();

  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';
  const backgroundColor = colorScheme === 'dark' ? 'rgba(211, 211, 211, 0.3)' : 'white';
  const allbackgroundColor = colorScheme === 'dark' ? 'black' : 'white';
  const borderColor = colorScheme === 'dark' ? 'white' : 'tomato';



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList); 
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.userContainer}>
        <View style={{display:'flex',flexDirection:'row',gap:10}}>

      {item.profileImage && (
          <Image
          source={{ uri: item.profileImage }}
          style={styles.profileImage}
          />
        )}
        <View>

      <Text style={{color:textColor}}>Document ID: {item.id}</Text>
      <Text style={{color:textColor}}>Alternative Email: {item.alternativeEmail}</Text>
      <Text style={{color:textColor}}>Location: {item.region}</Text>
      <Text style={{color:textColor}}>Phone: {item.phone}</Text>
      <Text style={{color:textColor}}>Phone Number: {item.phoneNumber}</Text>
      <Text style={{color:textColor}}>Role: {item.role}</Text>
      <Text style={{color:textColor}}>Username: {item.username}</Text>
      <Text style={{color:textColor}}>Website: {item.website}</Text>
      <Text style={{color:textColor}}>Website URL: {item.websiteUrl}</Text>
        </View>
        </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {users.length > 0 ? (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={{color:textColor}}>No users found.</Text>
      )}
    </View>
  );
};

export default AllUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  userContainer: {
    
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },

  profileImage: {
    width: 100,
    height: 100,
    
    marginBottom: 10,
  },
});
