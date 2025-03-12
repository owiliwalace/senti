import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Pressable } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '../../app/config/firebaseConfig';
import { Link } from 'expo-router';

interface UserData {
  id: string;
  email: string;
  role: 'super' | 'basic' | 'premium' | 'guest';
}

interface MenuProps {
  visible: boolean;
  onClose: () => void;
}

const Index: React.FC<MenuProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const colorScheme = useColorScheme();
  const [userData, setUserData] = useState<UserData | null>(null);

  const textColor = colorScheme === 'dark' ? 'white' : 'black';
  const backgroundColor = colorScheme === 'dark' ? 'rgba(37, 37, 37, 1)' : 'white';
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';

  useEffect(() => {
    if (!auth.currentUser) return;

    const userEmail = auth.currentUser.email;
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', userEmail));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const userDataFromFirestore = snapshot.docs[0].data() as UserData;
        setUserData(userDataFromFirestore);
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!visible) return null;

  const navigateTo = (screen: string) => {
    onClose();
    navigation.navigate(screen);
  };

  return (
    <View style={[styles.menu, { backgroundColor }]}>
      <Pressable style={styles.NavLinks} >
      <Link href={'/Settings'}>
        <Ionicons name="settings-outline" size={25} color={iconColor} />
        <Text style={[{ color: textColor }, styles.menuItem]}>Settings</Text>
      </Link>
      </Pressable>

      <Pressable style={styles.NavLinks}>
      <Link href={'/MyBidHistory'} style={{ color: textColor,textAlign:'center', alignItems: 'center', }}>
        <MaterialIcons name="history" size={25} color={iconColor} />
        <Text style={[{ color: textColor,textAlign:'center',alignSelf:'center' }, styles.menuItem]}>History</Text>
</Link>
      </Pressable>

      <Pressable style={styles.NavLinks} >
<Link href={'/Documentation'}>
        <Ionicons name="document-attach-outline" size={25} color={iconColor} />
        <Text style={[{ color: textColor }, styles.menuItem]}>Documentation</Text>
      </Link>
      </Pressable>

      {userData && (
        <>
          {(userData.role === 'super' || userData.role === 'basic' || userData.role === 'premium') && (
            <Pressable style={styles.NavLinks}>
              <Link href={'/TenderHistory'}>
              <MaterialIcons name="manage-history" size={20} color={iconColor} />
              <Text style={[{ color: textColor }, styles.menuItem]}>Tender History</Text>
              </Link>
            </Pressable>
          )}

          {(userData.role === 'super' || userData.role === 'premium') && (
            <TouchableOpacity style={styles.NavLinks}>
              <Link href={'/Analytics'}>
              <Ionicons name="analytics" size={20} color={iconColor} />
              <Text style={{ color: 'tomato', fontSize: 16 }}>Analytics</Text>
              <Link href={'/Documentation'}></Link></Link>
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
    marginVertical: 0,marginBottom:2,
    marginLeft:2
  },
  NavLinks: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default Index;
