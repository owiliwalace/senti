import { SafeAreaView, StyleSheet, Text, View, Image, useColorScheme, TouchableOpacity,
   ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, Stack, useRouter } from 'expo-router';
import MainCategories from '@/components/IndexPage/MainCategories';
import AllCategories from '@/components/IndexPage/AllCategories';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Menu from '@/components/Menu';
import { auth } from '../../app/config/firebaseConfig'; 
import LocationCity from '@/components/LocationCity';
import { LinearGradient } from 'expo-linear-gradient';

const Index = () => {
  const colorScheme = useColorScheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [refreshing, setRefreshing] = useState(false); 
  const router = useRouter(); 
  const [user, setUser] = useState(null); 

  const textColor = colorScheme === 'dark' ? 'white' : '#000000';
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';
  const backgroundColor = colorScheme === 'dark' ? 'black' : 'white';

  const handleNearMePress = () => {
    router.push('../NearMe'); 
  };



  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser); 
      } else {
        router.replace('../auth/Login'); 
      }
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
  
    await fetchData(); 
    setRefreshing(false);
  };


  const fetchData = async () => {
   
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Data fetched"); 
  };

  if (loading) {

    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color='tomato' />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[{ backgroundColor: backgroundColor }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerShadowVisible: true,
          
          headerLeft: () => (
            <View style={{ display: 'flex', gap: 0, flexDirection: 'column' }}>
              <Image 
                source={require('../../assets/images/senti.png')}
                style={{ width: 100, height: 40, marginLeft: 10, marginTop: 7 }}
              />
              <View style={{ marginLeft: 10, marginTop: -12 }}>
                <LocationCity />
              </View>
            </View>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center',
             marginRight: 10, gap: 20 }}>
              <TouchableOpacity onPress={() => console.log('pressed')}>
                <Link href='../Search'>
                  <AntDesign name="search1" size={25} color={iconColor} />
                </Link>
              </TouchableOpacity>
              <View>
                <MaterialCommunityIcons name="dots-vertical" size={24} 
                color={iconColor} onPress={toggleMenu} />
                <Menu visible={menuVisible} onClose={toggleMenu} role={''} />
              </View>
            </View>
          ),
        }}
      />
<TouchableOpacity style={{backgroundColor:backgroundColor, width:66,alignSelf:'flex-end'}}>
       <LinearGradient
              colors={['#add8e6', '#ff6347']} 
              locations={[0.2, 0.8]} 
              start={{ x: 1, y: 1 }} 
              end={{ x: 0, y: 1 }} 
              style={{
                width: 66, height: 24, alignItems: 'center', borderRadius: 7, marginTop: 3,
                alignSelf: 'flex-end', marginRight: 10
              }}
            >

      <TouchableOpacity onPress={handleNearMePress}
       style={{
        width: 63, backgroundColor: backgroundColor, 
        margin: 1, height: 22, borderRadius: 6,
        alignItems: 'center'
      }}>

      <Text style={[{ color: textColor, fontSize: 16,
         textAlignVertical:'center'}]}>Near Me</Text>
      </TouchableOpacity>
            </LinearGradient>
</TouchableOpacity>

        <MainCategories />
     
        <>
        <Text style={[{ color: textColor, fontSize: 20,marginLeft:5 }]}>Latest Tenders </Text>
        <ScrollView
          style={{height:500}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} 
          />
        }
      >
        <AllCategories />
        </ScrollView>
        </>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({});
