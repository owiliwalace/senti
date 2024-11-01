import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../app/config/firebaseConfig'; 
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore'; 
import { Stack } from 'expo-router';

const MyBidHistory = () => {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const userEmail = auth.currentUser?.email; 

    if (userEmail) {
      const bidsRef = collection(db, 'bids');
      const q = query(bidsRef, where('submitted_by_email', '==', userEmail));

     
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const bidData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBids(bidData); 
      });

     
      return () => unsubscribe();
    }
  }, [auth.currentUser?.email]);

 
  const formatDate = (timestamp: { toDate: () => any; }) => {
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate();

   
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      };

    
      return date.toLocaleString('en-US', options).replace('GMT', 'UTC'); 
    }
    return ''; 
  };

  const renderItem = ({ item }) => (
    <SafeAreaView>
      <Stack.Screen
      options={{
        title:'My Bid History'
      }}/>

    <View style={styles.bidItem}>
      
      <Text>Eligibility: {item.eligibility}</Text>
     
      <Text>Tender Title: {item.tender_title}</Text>
      <Text>Tender Owner: {item.bid_email}</Text>
      <Text>Submitted At: {formatDate(item.submitted_at)}</Text> 
      <Text>Closed on : {formatDate(item.due_date)}</Text>
      <Text>Venue for Opening: {item.venue}</Text>
      {/*<Text>Tender ID: {item.tender_id}</Text>*/}
    </View>
    </SafeAreaView>
  );

  return (
    <View>
     
      <FlatList
        data={bids}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default MyBidHistory;

const styles = StyleSheet.create({

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  bidItem: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
});
