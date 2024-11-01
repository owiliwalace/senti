import React, { useState, useRef, useMemo, useCallback } from 'react';
import { SafeAreaView, Text, View, StyleSheet, useColorScheme } from 'react-native';
import PagerView from 'react-native-pager-view';

import Basic from './Basic';
import Premium from './Premium';
import { Stack } from 'expo-router';

const Profile = () => {
  const [currentPage, setCurrentPage] = useState(0);
 
  const colorScheme = useColorScheme();

  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';
  const backgroundColor = colorScheme === 'dark' ? 'rgba(211, 211, 211, 0.3)' : 'white';
  const pagebackgroundColor = colorScheme === 'dark' ? 'black' : 'white';


  const snapPoints = useMemo(() => ['25%', '50%'], []);




  return (
    <SafeAreaView style={{backgroundColor:backgroundColor,height:'100%'}}>
      <Stack.Screen
     options={{
      title:'Payments'
     }}
      />
     
        <PagerView
         style={{ flex: 1,
          display:'flex',
          alignContent:'center',alignItems:'center', }}
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
    
          <View  key="1"
          style={{}}>
           <Basic />
     
          </View>

     
          <View key="2"
          >
           <Premium />
          </View>
        </PagerView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({



});

export default Profile;
