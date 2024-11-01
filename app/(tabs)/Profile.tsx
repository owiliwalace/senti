import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, 
  Alert, ScrollView, RefreshControl, useColorScheme, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Link, router, Stack } from 'expo-router';
import { auth, db, storage } from '../../app/config/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import Menu from '@/components/Menu';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Profile = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const currentUser = auth.currentUser;
  const colorScheme = useColorScheme();

  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';
  const backgroundColor = colorScheme === 'dark' ? 'rgba(211, 211, 211, 0.3)' : 'white';
  const allbackgroundColor = colorScheme === 'dark' ? 'black' : 'white';
  const borderColor = colorScheme === 'dark' ? 'white' : 'tomato';

  const handleNearMePress = () => {
    router.push('../EditProfile'); 
  };
  const handleIssueTenderPress = () => {
    router.push('../Payments'); 
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(docRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        Alert.alert('Error', 'User data not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch user data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData(); 
    setRefreshing(false);
  };

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission Denied', 'You need to grant camera permissions to change your profile picture.');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync();
      if (pickerResult.cancelled) return;

      const { uri } = pickerResult;
      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'users', currentUser.uid), {
        profileImage: downloadURL,
      });

      setUserData((prev) => ({ ...prev, profileImage: downloadURL }));
      Alert.alert('Success', 'Profile image updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };
  const animatedValue = useRef(new Animated.Value(-50)).current;

 
  useEffect(() => {
    const animateLight = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 150, 
            duration: 3200, 
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: -50, 
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animateLight();
  }, [animatedValue]);


  return (
    <SafeAreaView style={[{ backgroundColor: allbackgroundColor, height: '100%' }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <Text style={[{ color: textColor }, { fontSize: 30,
                 textTransform: 'lowercase', fontWeight: 600 }]}>
                {userData?.username}
              </Text>
            </View>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', 
            marginRight: 10, gap: 20 }}>
              <TouchableOpacity onPress={() => console.log('pressed')}>
                <Link href="#">
                  <AntDesign name="sharealt" size={24} color={iconColor} />
                </Link>
              </TouchableOpacity>
              <View>
                <MaterialCommunityIcons name="dots-vertical" 
                size={24} color={iconColor} onPress={toggleMenu} />
                <Menu visible={menuVisible} onClose={toggleMenu} role={''} />
              </View>
            </View>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={{display:'flex',flexDirection:'row',gap:10,marginRight: 15,
              marginLeft: 15,}}>
      {(userData?.role === 'bidder' || userData?.role === 'basic' || userData?.role === 'premium') && (            
                <>
                        <TouchableOpacity onPress={handleNearMePress} 
         style={{
          width: 95,
          height: 35,
          backgroundColor: backgroundColor, 
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 5,
          elevation: 5,
          marginTop:10
        }}
    >
          <Text style={[{ color: textColor, fontSize: 16 }]}>Edit Profile </Text>
        </TouchableOpacity>
        </>
      )}


        {(userData?.role === 'bidder' ) && (
          <>       
        <TouchableOpacity 
      onPress={handleIssueTenderPress} 
      style={[styles.button, { backgroundColor:backgroundColor, borderWidth:1,borderColor:borderColor }]}>
      <Animated.View 
        style={[
          styles.light,
          {
            transform: [{ translateX: animatedValue }],
          },
        ]}
      >
        <LinearGradient
              colors={['#add8e6', '#ff6347','#add8e6', ]} 
              locations={[0.2, 0.6,0.2]} 
              start={{ x: 1, y: 1 }} 
              end={{ x: 0, y: 1 }} 
              style={{
                width: 10, height: 40, alignItems: 'center', 
                alignSelf: 'flex-end', marginRight: 10
              }}
            />
            </Animated.View>
 <Text style={[styles.text, { color: textColor }]}>Issue Tender </Text>
         
    </TouchableOpacity>
    </>
    )}
    {(userData?.role === 'super' || userData?.role === 'basic' || userData?.role === 'premium') && (
              <>
                <View
                  style={{
                    width: 95,
                    height: 35,
                    backgroundColor: backgroundColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    elevation: 5,
                    marginTop:10
                  }}
                >
                  <Link href={'../PostTender'}>
                    <Text style={[{ color: textColor, fontSize: 16 }]}>Post Tender </Text>
                  </Link>
                </View>
             </>
    )
    }
    {(userData?.role === 'super' ) && (
              <>
                <View
                  style={{
                    width: 75,
                    height: 35,
                    backgroundColor: backgroundColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    elevation: 5,
                    marginTop:10
                  }}
                >
                  <Link href={'../AllTendersPosted'}>
                    <Text style={[{ color: textColor, fontSize: 16 }]}>All Tenders </Text>
                  </Link>
                </View>
             </>
    )
    }
    {(userData?.role === 'super' ) && (
              <>
                <View
                  style={{
                    width: 75,
                    height: 35,
                    backgroundColor: backgroundColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    elevation: 5,
                    marginTop:10
                  }}
                >
                  <Link href={'../AllBids'}>
                    <Text style={[{ color: textColor, fontSize: 16 }]}>All Bids </Text>
                  </Link>
                </View>
             </>
    )
    }
    {(userData?.role === 'super' ) && (
              <>
                <View
                  style={{
                    width: 75,
                    height: 35,
                    backgroundColor: backgroundColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    elevation: 5,
                    marginTop:10
                  }}
                >
                  <Link href={'../AllUsers'}>
                    <Text style={[{ color: textColor, fontSize: 16 }]}>All Users </Text>
                  </Link>
                </View>
             </>
    )
    }



    
        </View>

        <View style={[styles.profileContainer, { backgroundColor: backgroundColor }]}>
          <View>
            {userData?.profileImage ? (
              <TouchableOpacity onPress={handleImageUpload} disabled={uploading}
               style={{ display: 'flex', flexDirection: 'row' }}>
                <Image source={{ uri: userData.profileImage }} 
                style={styles.profileImage} />
                <MaterialIcons name="add-circle" size={24} color={iconColor} 
                style={{ marginLeft: -25 }} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleImageUpload} disabled={uploading}>
                <Image source={require('../../assets/main/extra.png')} style={styles.profileImage} />
              </TouchableOpacity>
            )}
          </View>
          <View>
            <Text numberOfLines={1} style={[styles.profileText, { color: textColor }]}>
              {userData?.username || 'N/A'} </Text>
            <Text numberOfLines={1} style={[styles.profileText, { color: textColor }]}>
              {userData?.email || currentUser?.email} </Text>
          </View>
        </View>

        <View style={[styles.contactInfoContainer, { backgroundColor: backgroundColor }]}>
          <Text style={[styles.profileText, { color: textColor }]}>{userData?.phone || 'N/A'} </Text>
          <Text style={[{ color: textColor }]}>•</Text>
          <Text style={[styles.profileText, { color: textColor }]}>{userData?.country || 'N/A'} </Text>
          <Text style={[{ color: textColor }]}>•</Text>
          <Text style={[styles.profileText, { color: textColor }]}>{userData?.website || 'N/A'} </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    width: '96%',
    alignSelf: 'center',
    paddingLeft: 10,
    paddingTop: 10,
    elevation: 3,
    borderRadius: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 10,
  },
  contactInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    elevation: 3,
    width: '96%',
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 7,
    padding: 25,
  },
  button: {
    width: 95,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    elevation: 5,
    overflow: 'hidden', // Ensure light stays inside button
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    zIndex: 1, // Ensure the text is above the light
    
  },
  light: {
    position: 'absolute',
    width: 20, 
    height: '100%',
    //backgroundColor: 'rgba(255, 255, 255, 0.3)', // Light color
    //borderRadius: 5,
    zIndex: 0, // Ensure the light is below the text
    
  },
});
