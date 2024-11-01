import React, {  useRef, useMemo, useCallback } from 'react';
import { SafeAreaView, Text, View,  StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';

import { BottomSheetModalProvider, BottomSheetModal } from '@gorhom/bottom-sheet';
import { AntDesign, Feather } from '@expo/vector-icons';

const Basic = () => {
 
  const bottomSheetModalRef = useRef(null);
  const colorScheme = useColorScheme();

  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';
  const backgroundColor = colorScheme === 'dark' ? 'rgba(211, 211, 211, 0.3)' : 'white';

  const pagebackgroundColor = colorScheme === 'dark' ? 'black' : 'white';

  // Set bottom sheet snap points
  const snapPoints = useMemo(() => ['30%', '60%'], []);

  // Show the bottom sheet
  const openBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <View style={{height:'100%'}}>
      
        <BottomSheetModalProvider
        
        >
          <View style={{display:'flex',flexDirection:'row' , 
                alignContent:'center',alignItems:'center'}}>
              <Text style={{ padding:6,fontSize:25,
                      textAlign:'center',color:'white',
                        marginLeft:'40%'}}>Basic </Text>
                      <AntDesign name="arrowright" size={24} color="white" 
                      style={{marginRight:'5%'}}
                      />             
          </View>
    <View style={{
        backgroundColor:pagebackgroundColor,width:'95%', 
    alignContent:'center',alignSelf:'center', 
    borderColor:'tomato',borderWidth:0.3,
    height:'50%', borderRadius:8}}>
             
            
<View style={{marginTop:20}} >
<Text style={{color:textColor, marginLeft:15}}>Enhanced Experience</Text>
</View>

<View style={{display:'flex',flexDirection:'row', alignSelf:'center',
                alignItems:'center',justifyContent:'space-between',
                width:'90%',marginHorizontal:'2%'}}>
   <Text style={{color:textColor}}>Post Tenders </Text>
              <Feather name="check" size={24} color="green" />
</View>

              <View style={{display:'flex',flexDirection:'row', alignSelf:'center',
                alignItems:'center',justifyContent:'space-between',
                width:'90%',marginHorizontal:'2%'}}>
              <Text style={{color:textColor}}>Analytics </Text>
              <AntDesign name="lock" size={24} color="red" />
              </View>
              </View>
     
   
    
    <View >
            <TouchableOpacity onPress={openBottomSheet} 
            style={{backgroundColor:'skyblue',height:40,width:80,alignItems:'center',
              borderRadius:3, alignSelf:'center',marginTop:5
            }}>
              <Text style={{textAlign:'center', fontSize:15,justifyContent:'center',
                alignItems:'center',alignContent:'center',padding:'10%'
              }}>Price </Text>
            </TouchableOpacity>
          </View>


    <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          index={0}
         
        >
      <View style={{display:'flex',flexDirection:'row',
      gap:5,width:350,height:100,alignSelf:'center'}}>

        <View style={{width:'50%',borderColor:'black',
        borderWidth:0.35,borderRadius:5,
          paddingTop:10,marginBottom:5,paddingLeft:5}}>
                      
            <View style={{display:'flex',flexDirection:'row', gap:5}}>
            <Text style={{color:'gray'}}>Annual Plan</Text> 
            <View style={{backgroundColor:'lightgreen',width:65,borderRadius:3}}>
              <Text style={{textAlign:'center',fontWeight:'500'}}>Save 9.09%</Text>
            </View>
            </View>
            <View style={{marginTop:5}}>

            <Text style={{fontWeight:'700',fontSize:20}}>Ksh 110,000 / year</Text>
            <Text style={{fontWeight:'400',fontSize:12,color:'gray',marginTop:5}}>
              Ksh 110,000 per year billed annually </Text>
            </View>
        </View>
        <View style={{width:'50%',borderColor:'black',borderWidth:0.35,
          borderRadius:5,paddingTop:10,marginBottom:5,paddingLeft:5}}>
            <Text style={{color:'gray'}}>Monthly Plan</Text>
            <View style={{marginTop:5}}>

            <Text style={{fontWeight:'700',fontSize:20}}>Ksh 10,000 / month</Text>
            <Text style={{fontWeight:'400',fontSize:12,color:'gray',marginTop:5}}>
              Ksh 120,000 per year billed annualy</Text>
            </View>
        </View>
     
              </View>
       
        </BottomSheetModal>

    </BottomSheetModalProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },

 
});

export default Basic;
