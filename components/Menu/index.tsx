import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '../../app/config/firebaseConfig'; // Ensure the path is correct

interface MenuProps {
  visible: boolean;
  onClose: () => void;
  role: string;
}

const Index: React.FC<MenuProps> = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [userData, setUserData] = useState(null); 

  const textColor = colorScheme === 'dark' ? 'white' : 'black';
  const backgroundColor = colorScheme === 'dark' ? 'rgba(37, 37, 37, 1)' : 'white';
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = () => {
      const userEmail = auth.currentUser?.email; 

      if (userEmail) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', userEmail)); 

        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const userDataFromFirestore = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];
            setUserData(userDataFromFirestore); // Set the first user document to state
          } else {
            setUserData(null); 
          }
        });

        return () => unsubscribe(); 
      }
    };

    fetchUserData();
  }, []); 

  if (!visible) return null; // Conditional rendering based on visibility

  const navigateTo = (screen: string) => {
    onClose();
    navigation.navigate(screen);
  };

  return (
    <View style={[styles.menu, { backgroundColor }]}>
      <TouchableOpacity style={styles.NavLinks} onPress={() => navigateTo('Settings')}>
        <Ionicons name="settings-outline" size={20} color={iconColor} />
        <Text style={[{ color: textColor }, styles.menuItem]}>Settings </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.NavLinks} onPress={() => navigateTo('MyBidHistory')}>
        <MaterialIcons name="history" size={20} color={iconColor} />
        <Text style={[{ color: textColor }, styles.menuItem]}>History </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.NavLinks} onPress={() => navigateTo('Documentation')}>
        <Ionicons name="document-attach-outline" size={20} color={iconColor} />
        <Text style={[{ color: textColor }, styles.menuItem]}>Documentation </Text>
      </TouchableOpacity>

   
      {userData && (
        <>
          {(userData.role === 'super' || userData.role === 'basic' || userData.role === 'premium') && (
            <TouchableOpacity style={styles.NavLinks} onPress={() => navigateTo('TenderHistory')}>
              <MaterialIcons name="manage-history" size={20} color={iconColor} />
              <Text style={[{ color: textColor }, styles.menuItem]}>Tender History </Text>
            </TouchableOpacity>
          )}

          {(userData.role === 'super' || userData.role === 'premium') && (
            <TouchableOpacity style={styles.NavLinks} onPress={() => navigateTo('Analytics')}>
              <Ionicons name="analytics" size={20} color={iconColor} />
              <Text style={{ color: 'tomato', fontSize: 16 }}>Analytics </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    right: 0,
    top: 42,
    marginRight: 1,
    borderRadius: 10,
    padding: 10,
    width: 155,
    elevation: 4,
    zIndex: 90,
  },
  menuItem: {
    fontSize: 16,
    marginVertical: 5,
  },
  NavLinks: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    marginBottom: 1.5,
  },
});

export default Index;
