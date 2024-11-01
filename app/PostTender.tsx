import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Platform,
   SafeAreaView, ScrollView, 
   useColorScheme} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '../app/config/firebaseConfig'; // Firebase setup
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Picker } from '@react-native-picker/picker';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp
import Toast from 'react-native-toast-message';

const PostTender = () => {

  const colorScheme = useColorScheme();

  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const PlaceholdertextColor = colorScheme === 'dark' ? 'gray' : 'gray';
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';
  const backgroundColor = colorScheme === 'dark' ? 'rgba(211, 211, 211, 0.3)' : 'white';
  const allbackgroundColor = colorScheme === 'dark' ? 'black' : 'white';
  const borderColor = colorScheme === 'dark' ? 'white' : 'tomato';

  const [category, setCategory] = useState(''); 
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date()); 
  const [dueTime, setDueTime] = useState(new Date()); 
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [eligibility, setEligibility] = useState(''); 
  const [fee, setFee] = useState('');
  const [financialYear, setFinancialYear] = useState('');

  const [location, setLocation] = useState(''); 
  const [tenderNumber, setTenderNumber] = useState('');
  const [tenderTitle, setTenderTitle] = useState('');
  const [venue, setVenue] = useState('');

  const [email, setEmail] = useState(''); 

  const fetchUserDetails = async () => {
    const currentUser = getAuth().currentUser;

    if (currentUser) {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '==', currentUser.email));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        setEmail(userData.email); 
        setLocation(userData.location);
      });
    }
  };

  useEffect(() => {
    fetchUserDetails(); 
  }, []);

  const getCombinedDateTime = () => {
    const combined = new Date(dueDate);
    combined.setHours(dueTime.getHours());
    combined.setMinutes(dueTime.getMinutes());
    return combined;
  };

  const handlePostTender = async () => {
    if (!category || !description || !tenderTitle ) {
      //Alert.alert('Error', 'Please fill in all required fields.');
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Please fill in all required fields.',
      });
      return;
    }

    try {
      await addDoc(collection(db, 'tender'), {
        category,
        description,
        due_date: Timestamp.fromDate(getCombinedDateTime()), 
        eligibility,
        fee,
        financial_year: financialYear,
        location, 
        tender_number: tenderNumber,
        tender_title: tenderTitle,
        venue,
      
        email, 
      });

      Alert.alert('Success', 'Tender posted successfully!');
    } catch (error) {
      Alert.alert('Error', 'There was an error posting the tender.');
      console.error('Error adding document: ', error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDueDate(selectedDate);
    }
    if (Platform.OS === 'android') {
      setShowDatePicker(false); 
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      setDueTime(selectedTime);
    }
    if (Platform.OS === 'android') {
      setShowTimePicker(false); 
    }
  };

  return (
    <SafeAreaView style={{backgroundColor:allbackgroundColor}}>
    
      <ScrollView>
        <View style={{}}>
        <View style={styles.perline}>

    <Text style={{color:textColor}}> Category : </Text>
    <View style={{borderWidth:0.31, borderColor:borderColor,width:'74%',}}>

          <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}
            style={{ flex: 1, borderWidth:1, borderColor:'black',color:textColor }}>
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Health" value="health" />
            <Picker.Item label="Education" value="Education" />
            <Picker.Item label="County" value="COUNTY" />
            <Picker.Item label="Transport" value="transport" />
            
            <Picker.Item label="Institutional" value="institutional" />

            <Picker.Item label="Construction" value="construction" />
            <Picker.Item label="Farming" value="farming" />
          </Picker>
    </View>
          </View>
          <View style={styles.perline}>

<Text style={{color:textColor}}>Description : </Text>
          <TextInput
            placeholder="Tender Description"
            value={description}
            onChangeText={setDescription}
            style={[styles.input,{color:textColor}]}
            placeholderTextColor={PlaceholdertextColor}
            maxLength={40}
            
            
          />
          </View>
          <View style={styles.perline}>
<Text style={{color:textColor}}>Due Date : </Text>
 <View style={{ display:'flex', gap:15, justifyContent:'center'

 }}>
  <View style={{display:'flex',flexDirection:'row', alignContent:'center',justifyContent:'center'}}>

            <Text style={{color:textColor}}>Date : {dueDate.toLocaleDateString()} </Text>
            <Text style={{color:textColor}}> & </Text>
            <Text style={{color:textColor}}> Time : {dueTime.toLocaleTimeString()}</Text>
</View>
<View style={{flexDirection:'row', gap:5, alignItems:'center', width:'100%',
  alignContent:'center',justifyContent:'center',marginBottom:3
}}>
          <Button title="Pick Due Date" onPress={() => setShowDatePicker(true)} />
          {showDatePicker && (
            <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={handleDateChange} 
            />
          )}
              <Button title="Pick Due Time" onPress={() => setShowTimePicker(true)} />
          {showTimePicker && (
            <DateTimePicker
            value={dueTime}
            mode="time"
            display="default"
            onChange={handleTimeChange} 
            />
          )}
    </View>
        
</View>
</View>

<View style={styles.perline}>

    <Text style={{color:textColor}}> Eligibility : </Text>
    <View style={{borderWidth:0.31, borderColor:borderColor,width:'74%',}}>
          <Picker selectedValue={eligibility} onValueChange={(itemValue) => setEligibility(itemValue)}
             style={{ flex: 1 ,color:textColor,backgroundColor:allbackgroundColor}}>
            <Picker.Item label="Select Eligibility" value="" />
            <Picker.Item label="Open for All" value="open for All" />
            <Picker.Item label="Women & Youth" value="Women & Youth" />
            <Picker.Item label="Reserved" value="Reserved" />
          </Picker>
          </View>
</View>
<View style={styles.perline}>
<Text  style={{color:textColor}}>Fee : </Text>
          <TextInput placeholder="Fee as per each tender document" value={fee} onChangeText={setFee} 
          placeholderTextColor={PlaceholdertextColor}   style={[styles.input,{color:textColor}]} keyboardType="numeric" />
    </View>
    <View style={styles.perline}>
  <Text style={{color:textColor}}>Financial Year </Text>
          <TextInput placeholder="Financial Year" value={financialYear} onChangeText={setFinancialYear}
           placeholderTextColor={PlaceholdertextColor}  style={[styles.input,{color:textColor}]}
           keyboardType="numeric"/>
           </View>


           <View>

          <TextInput value={location} onChangeText={setLocation} editable={false} 
            placeholderTextColor={PlaceholdertextColor} style={{ display: 'none' }}   />
            </View>


            <View style={styles.perline}>
<Text style={{color:textColor}}>Tender Number: </Text>
          <TextInput placeholder="Tender Number" value={tenderNumber} onChangeText={setTenderNumber} 
            placeholderTextColor={PlaceholdertextColor}   style={[styles.input,{color:textColor}]} />
            </View>
            <View style={styles.perline}>
<Text style={{color:textColor}}>Tender Title : </Text>
          <TextInput placeholder="Tender Title" value={tenderTitle} onChangeText={setTenderTitle} 
         placeholderTextColor={PlaceholdertextColor}   style={[styles.input,{color:textColor}]} />
         </View>
         <View style={styles.perline}>
<Text style={{color:textColor}}>Venue : </Text>
          <TextInput placeholder="Venue where the tender will be opened" value={venue} onChangeText={setVenue} 
           placeholderTextColor={PlaceholdertextColor}   style={[styles.input,{color:textColor}]} />
           </View>


          <Button title="Post Tender" onPress={handlePostTender} />
        </View>
      </ScrollView>
      
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default PostTender;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width:'74%',
   
  },
  perline:{
    width:'96%',
    display:'flex',flexDirection:'row',
     alignItems:'center',
     justifyContent:'space-between',
     marginHorizontal:'2%',
     
     marginTop:1
  }
});
