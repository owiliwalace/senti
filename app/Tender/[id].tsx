import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  Button,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, getFirestore, Timestamp, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { app } from '../../app/config/firebaseConfig';
import { getAuth } from 'firebase/auth';
import BottomSheet from '@gorhom/bottom-sheet';
import { ResizeMode, Video } from 'expo-av';
import Toast from 'react-native-toast-message';

interface Tender {
  fee: string;
  financial: string;
  financial_year: string;
  venue: string;
  tender_name: string;
  profile: string;
  verified: string;
  tender_title: string;
  due_date?: Timestamp; 
  id: string;
  category: string;
  category_no: string;
  eligibility: string;
  description01?: string; 
  email?: string; 
  location:string;
}

const DetailScreen: React.FC = () => {

  const colorScheme = useColorScheme();

  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const PlaceholdertextColor = colorScheme === 'dark' ? 'gray' : 'gray';
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';
  const backgroundColor = colorScheme === 'dark' ? 'gray' : 'black';
  const allbackgroundColor = colorScheme === 'dark' ? 'black' : 'white';
  const borderColor = colorScheme === 'dark' ? 'white' : 'tomato';

  
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [loading, setLoading] = useState(true);
  const [tender, setTender] = useState<Tender | null>(null);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    userEmail: ''
  });

  const firestore = getFirestore(app);
  const router = useRouter();
  const auth = getAuth();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchTender = async () => {
      if (id) {
        try {
          const tenderDoc = doc(firestore, 'tender', id as string);
          const tenderSnapshot = await getDoc(tenderDoc);
          if (tenderSnapshot.exists()) {
            const tenderData = { id: tenderSnapshot.id, ...tenderSnapshot.data() } as Tender;
            setTender(tenderData);

            if (tenderData.email) {
              const usersQuery = query(collection(firestore, 'users'), where('email', '==', tenderData.email));
              const usersSnapshot = await getDocs(usersQuery);
              if (!usersSnapshot.empty) {
                const userDoc = usersSnapshot.docs[0];
                const userData = userDoc.data();
                setUserProfileImage(userData.profileImage);
                setUserData(userData);
                setFormData(prevData => ({ ...prevData, userEmail: userData.email }));
              }
            }
          } else {
            console.error("Tender not found");
          }
        } catch (error) {
          console.error("Error fetching tender: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTender();

    // Set the current user's email
    const currentUser = auth.currentUser;
    if (currentUser) {
      setFormData(prevData => ({ ...prevData, userEmail: currentUser.email || '' }));
    }
  }, [id]);

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const { userEmail, code } = formData;
    const currentUserEmail = auth.currentUser?.email || '';

    if (!userEmail || !code) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    try {
      await addDoc(collection(firestore, 'bids'), {
        category: tender?.category,
        tender_title: tender?.tender_title,
        tender_id: tender?.id,
        code: code,
        bid_email: userEmail,
        submitted_by_email: currentUserEmail, 
        submitted_at: Timestamp.now(), 
        financial:tender?.financial,
        fee:tender?.fee,
        venue:tender?.venue,
        
        due_date:tender?.due_date,
        eligibility:tender?.eligibility,
      });
      Alert.alert('Success', 'Bid submitted successfully');
    } catch (error) {
      console.error('Error submitting bid:', error);
      Alert.alert('Error', 'Failed to submit bid: ' + error.message);
    }
  };

  const handlePress = () => {
    if (userData) {
      router.push({
        pathname: '/IssuerProfile',
        params: {
          profileImage: userData.profileImage,
          email: userData.email,
          phone: userData.phone,
          location: userData.location,
          website: userData.website,
        }
      });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="tomato" style={{ flex: 1 }} />;
  }

  if (!tender) {
    return <Text>No tender details available.</Text>;
  }

  const formatDate = (timestamp?: Timestamp) => {
    if (timestamp) {
      const date = timestamp.toDate();
      return date.toLocaleDateString();
    }
    return 'N/A';
  };

  return (
    <SafeAreaView style={{ height: '100%', backgroundColor:allbackgroundColor}}>
      <Stack.Screen
        options={{
        
          headerTitle:tender.category,
          headerBackButtonMenuEnabled:true
        }}
      />
      <ScrollView>
        <View style={styles.heroContainer}>
          <Image
            source={userProfileImage ? { uri: userProfileImage } : require('../../assets/main/extra.png')}
            style={styles.heroimage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={styles.userImageContainer}>
              <Image
                source={userProfileImage ? { uri: userProfileImage } : require('../../assets/main/extra.png')}
                style={styles.smallImage}
                resizeMode="cover"
              />
            </View>
            <View style={{display:'flex', flexDirection:'row', alignContent:'center',
              alignItems:'center', gap:8}}>
              <Pressable style={{borderColor:borderColor, borderWidth:0.51, padding:10,
               borderRadius:25, backgroundColor:backgroundColor}} 
              onPress={() => bottomSheetRef.current?.expand()}>
                <Text style={[styles.reportButtonText,{color:"white"}]}>Report</Text>
              </Pressable>
              {userData && (
                <Pressable style={styles.button} onPress={handlePress}>
                  <Text style={styles.buttonText}>View Profile</Text>
                </Pressable>
              )}
            </View>
          </View>

          <Text style={[styles.title,{color:textColor}]}>County: {tender.location}</Text>
          <Text style={[styles.subtitle,{color:textColor}]}>{tender.category}</Text>
          <Text style={[styles.title ,{color:textColor}]}>Tender Title : {tender.tender_title}</Text>
          <Text style={[styles.moreInfo ,{color:textColor}]}>Eligibility: {tender.eligibility}</Text>
          <Text style={[styles.moreInfo ,{color:textColor}]}>
            Due Date: <Text style={{ color: "tomato" }}>{formatDate(tender.due_date)}</Text>
          </Text>
         
          <Text style={[styles.subtitle,{color:textColor}]}>Fee : {tender.fee || 'N/A'}</Text>
          <Text style={[styles.subtitle,{color:textColor}]}>Financial Year : {tender.financial || 'N/A'}</Text>
          <Text style={[styles.subtitle,{color:textColor}]}>Venue for the tender opening: {tender.venue || 'N/A'}</Text>
     
         
         

          <View style={styles.formContainer}>
           
              <>
                           <TextInput
                readOnly
                style={{ display: 'none' }}  
                value={tender.category}
              />
            

          
              <TextInput
                readOnly
                style={{ display: 'none' }}  
                value={tender.tender_title}
              />
   
            <TextInput
                readOnly
                style={{ display: 'none' }}  
                value={formatDate(tender.due_date)}
              />
              <TextInput
                readOnly
                style={{ display: 'none' }}  
                value={tender.eligibility}
              />

<TextInput
                readOnly
                style={{ display: 'none' }}  
                value={tender.venue}
              />

              <TextInput
                readOnly
                style={{ display: 'none' }}  
                value={formData.userEmail} // Set to the current user's email
              />
        

              <TextInput
                readOnly
                style={{ display: 'none' }}  
                value={auth.currentUser?.email || ''} // Directly using auth.currentUser's email
              />
    </>

            <View style={styles.formContent}>
              <Text style={[styles.formLabel,{color:textColor}]}> Transaction Code:</Text>
              <TextInput
                style={[styles.input,{color:textColor}]}
                value={formData.code}
                onChangeText={(text) => handleInputChange('code', text)}
                placeholderTextColor={textColor}
                placeholder='Transaction Code'
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Submit Bid" onPress={handleSubmit} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sheet for Reporting */}
      <BottomSheet
          ref={bottomSheetRef}
          index={-1} 
          snapPoints={['50%', '50%']}
          enablePanDownToClose={true} 
          
        >
          <View style={styles.bottomSheetContent}>
         
            <Video
        source={{ uri: 'https://cdnl.iconscout.com/lottie/premium/thumb/policeman-wearing-cap-animated-icon-download-in-lottie-json-gif-static-svg-file-formats--police-security-officer-male-avatar-pack-people-icons-10184809.mp4' }}
        style={{ width: 200,
          height: 130, alignSelf:'center'}}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true}           
          isLooping={true}           
          useNativeControls={false} 
      />
        <Text style={styles.bottomSheetTitle}>Report Issue</Text>
            <TextInput
              placeholder="Describe your issue"
              style={styles.bottomSheetInput}
              multiline
            />
            <Button title="Submit Report" onPress={() => {
             
              
              Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Report',
                text2: 'Report Submitted Successfully, thank you.',
              });
              bottomSheetRef.current?.close(); 
            }} />
          </View>
        </BottomSheet>
        <Toast ref={(ref) => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    width: '100%',
    height: 90, 
    overflow: 'hidden',
    backgroundColor: 'lightgrey',
    marginBottom: -5,
    
  },
  heroimage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 10,
    paddingBottom:0,
  },
  headerImage:{
  height: 45,
  width: 45,
  borderWidth:1.3,
  borderColor:'white',
  borderRadius:55,
  },
  smallImage: {
    height: 70,
    width: 70,
    borderWidth:1.3,
    borderColor:'white',
    borderRadius:55,
    marginTop:-30
  },
  verifiedImage: {
    height: 17,
    width: 17,
  },
  hidden: {
    display: 'none', 
    opacity:0,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 2,
  },
  moreInfo: {
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    marginVertical: 5,
  },
   
    formContainer: {
      marginTop: 0,
      paddingTop: 0,
    },
    formContent:{
display:'flex',flexDirection:'row',justifyContent:'space-between'
    },
    formLabel: {
      fontSize: 16,
      marginBottom: 5,
      textAlignVertical:'center'
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingLeft:8,
      marginBottom: 10,
      overflow: 'hidden',
      width:'60%',
      height:40
    },
    button: {
      
      padding: 10,
      borderRadius: 25,
      alignItems: 'center',
      marginVertical: 10,
      borderColor:'tomato',
      borderWidth:.52,
    },
    buttonText: {
      color: 'tomato',
      fontSize: 16,
    },
    reportButon:{
      padding: 10,
      borderRadius: 25,
      alignItems: 'center',
      marginVertical: 10,
      borderColor:'black',
      borderWidth:.52,
      backgroundColor:'black'
    },
    reportButtonText: {
      color: 'white',
      fontSize: 16,
    },
    bottomSheetContent: {
      paddingHorizontal: 10,
      
    },
    bottomSheetTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 1,
      alignSelf:'center'
    },
    bottomSheetInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 2,
      height: 60,
    },
  });
  
  export default DetailScreen;

