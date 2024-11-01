import { View, Text,StyleSheet,Image,useColorScheme } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'

const Chats = () => {
    const colorScheme = useColorScheme();

    const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
    const allbackgroundColor=  colorScheme === 'dark' ? 'black' : 'white';
  return (
    <SafeAreaView style={[ {backgroundColor:allbackgroundColor,height:'100%'}]}>
<Stack.Screen
options={{
    headerShown:true,
    headerShadowVisible: true,
    title:'',
    headerLeft: () => (
        <View style={{ display: 'flex', gap: 0, 
        flexDirection: 'col', alignItems: 'center' }}>
        <Text style={{ color: textColor }}> Chats </Text>
          
        </View>
      ),
}}/>

    <View style={{alignItems:'center',height:'100%',justifyContent:'center'}}>
      <Text style={{ color: textColor }}> No Chats </Text>
    </View>
    </SafeAreaView>
  )
}

export default Chats