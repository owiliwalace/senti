import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  useColorScheme
} from 'react-native';
import { db } from '../../app/config/firebaseConfig'; // Import Firestore from your config
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore'; // Import Firestore functions
import { useLocalSearchParams, router, Stack } from 'expo-router'; 

const CATEGORIES = ['Health', 'Education', 'COUNTY', 'Transport', 'Institutional', 'Construction', 'Farming'];

const UserDetailsScreen: React.FC = () => {
  const { profileImage, email, phone, location, website,username } = useLocalSearchParams();
  const [tenders, setTenders] = useState<any[]>([]); // State to store tenders
  const [usersMap, setUsersMap] = useState<{ [key: string]: string }>({}); // State to store users map (email -> profileImage)
  const [activeCategory, setActiveCategory] = useState('Health'); // Default category
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#ffffff' : 'black';
  const borderBottomColor = colorScheme === 'dark' ? 'white' : 'black';
  const backgroundColor=  colorScheme === 'dark' ? 'rgba(211, 211, 211, 0.3)' : 'white';
  const mainBgColor = colorScheme === 'dark' ? 'black' : 'white';

  useEffect(() => {
    const fetchTendersAndUsers = async () => {
      try {
        // Fetch tenders related to the current email
        const tendersQuery = query(collection(db, 'tender'), where('email', '==', email));
        const tendersSnapshot = await getDocs(tendersQuery);
        const tendersList = tendersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch users documents
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Create a map of users by email for quick access
        const usersMap = usersList.reduce((acc, user) => {
          if (user.email) {
            acc[user.email] = user.profileImage; // Map email to profileImage
          }
          return acc;
        }, {} as { [key: string]: string });

        // Set the states
        setTenders(tendersList);
        setUsersMap(usersMap); // Set the users map
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchTendersAndUsers();
  }, [email]);

  const handlePress = (tender: any) => {
    router.push(`/Tender/${tender.id}`);
  };

  // Convert Firestore Timestamp to a readable date string
  const formatDate = (timestamp?: Timestamp) => {
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate();
      return date.toLocaleDateString(); // Adjust format as needed
    }
    return 'N/A'; // Return fallback if the timestamp is undefined
  };

  const filteredTenders = tenders.filter(tender => tender.category === activeCategory);

  const renderTenderItem = ({ item }: { item: any }) => (
    <Pressable onPress={() => handlePress(item)}>
      <View style={[styles.tenderItemContainer, { borderBottomColor }]}>
        <View style={styles.itemContent}>
        {usersMap[item.email] ? (
          <Image
              source={{ uri: usersMap[item.email] }}
              style={styles.userImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={{ color: textColor }}>No Image Available</Text>
          )}
          <View>

          <Text style={{ color: textColor }}>Category: {item.category}</Text>
          <Text numberOfLines={1} style={[styles.title, { color: textColor }]}>
            {item.tender_title || 'No Title'}  
          </Text>
          <Text style={[styles.moreInfo, { color: textColor }]}>Due Date: {formatDate(item.due_date)} </Text>
          </View>
          
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={{backgroundColor:mainBgColor,height:'100%'}}>
    <SafeAreaView >
      <Stack.Screen options={{ headerBackVisible: true, title: `${username || email}` }} />
      <View>
        <View style={[styles.profileContainer, {backgroundColor:backgroundColor}]}>

       
         
          <Text style={[styles.detail, { color: textColor }]}>Email: {email || 'N/A'} </Text>

        <View style={{display:'flex',flexDirection:'row'}} >
          <Text style={[styles.detail, { color: textColor }]}>{phone || 'N/A'} </Text>
          <Text style={{ color: textColor }}>•</Text>
          <Text style={[styles.detail, { color: textColor }]}>{location || 'N/A'} </Text>
          <Text style={{ color: textColor }}>•</Text>
          <Text style={[styles.detail, { color: textColor }]}>{website || 'N/A'} </Text>
        </View>
        </View>

      </View>

  
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryPager}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setActiveCategory(category)}
            style={[styles.categoryButton, activeCategory === category && styles.activeCategoryButton]} 
          >
            <Text style={activeCategory === category ? styles.activeCategoryText : styles.categoryText}>
               {category} </Text> 
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredTenders}
        renderItem={renderTenderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.tendersList}
        ListEmptyComponent={() => <Text style={styles.emptyListText}>No tenders available for {activeCategory}</Text>}
      />
    </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 9,
    width: '93%',
    alignSelf: 'center',
    gap: 9,
    height: 80,
    marginTop: 10,
    overflow: 'hidden',
    elevation: 2,
    paddingTop:15
  },
  contactInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
   // alignItems: 'center',
    borderRadius: 9,
    width: '94%',
   // alignSelf: 'center',
    height: 50,
    marginTop: 0,
    elevation: 2,
   // justifyContent: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 55,
    marginLeft: 8,
  },
  detail: {
    fontSize: 18,
    marginLeft: 10,
  },
  tendersList: {
    paddingLeft: 10,
  },
  tenderItemContainer: {
    width: '98%',
    height: 70,
    overflow: 'hidden',
    borderBottomWidth: 1,
   
    margin:0,
  },
  itemContent: {
    display:'flex',
    flexDirection:'row',
    alignItems:'center'
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  moreInfo: {
    color: 'gray',
  },
  categoryPager: {
    height: 55,
    //marginTop: 3,
    marginLeft:15
  },
  categoryButton: {
    marginRight: 10,
    height: 30,
    alignSelf: 'center',
    alignItems: 'center',
    width: 90,
    justifyContent: 'center',
    borderWidth: 0.25,
    borderColor: 'tomato',
  },
  activeCategoryButton: {
    backgroundColor: 'tomato',
    borderColor: 'tomato',
  },
  activeCategoryText: {
    color: 'white',
  },
  categoryText: {
    color: 'tomato',
    
  },
  userImage: {
    width: 55,
    height: 55,
    borderRadius: 35,
    marginTop: 5,
    marginRight: 5,
  },
  emptyListText: {
    textAlign: 'center',
   // marginTop: 20,
    color: 'gray',
  },
});

export default UserDetailsScreen;
