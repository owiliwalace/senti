import { StyleSheet, Text, View, FlatList, Pressable, useColorScheme } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

// Define the type for the items in the FlatList
interface Item {
  id: string;
  name: string;
  title:string;
}

const data: Item[] = [
  { id: '1', name: 'PQ1',title:'Registration Documentation' },
  { id: '2', name: 'PQ2' ,title:'Pre-qualification Data'},
  { id: '3', name: 'PQ3' ,title:'Supervisory Personel'},
  { id: '4', name: 'PQ4' ,title:'Financial Position'},
  { id: '5', name: 'PQ5' ,title:'Past Experience'},
  { id: '6', name: 'PQ6' ,title:'Sworn Statement'},
  { id: '7', name: 'PQ7' ,title:'Confidential Questionnaires'},
  { id: '8', name: 'PQ8' ,title:'Litigation History'},
 // { id: '9', name: 'PQ9' ,title:'Registration Documentation'},
];

const Documentation: React.FC = () => {
    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
    const backgroundColor=  colorScheme === 'dark' ? 'rgba(211, 211, 211, 0.3)' : 'white';
    const bgColor = colorScheme === 'dark' ? 'black' : 'white';

  const router = useRouter();

  // Handle press to navigate to the dynamic page
  const handlePress = (id: string) => {
    router.push(`/DocumentationDetails/${id}`); // Dynamic route
  };

  // Render each item in the FlatList
  const renderItem = ({ item }: { item: Item }) => (

    <Pressable onPress={() => handlePress(item.id)} style={[styles.item, {backgroundColor:backgroundColor}]}>
      <Text style={[styles.title,{color:textColor}]}>{item.name}</Text>
      <Text style={[styles.title,{color:textColor}]}> : </Text>
      <Text style={[styles.title,{color:textColor}]}>{item.title}</Text>
    </Pressable>
  );

  return (

    <View style={[styles.container,{backgroundColor:bgColor, height:'100%'}]}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Documentation;

const styles = StyleSheet.create({
  container: {
    
    padding: 10,
  },
  item: {
   // backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 5,
    borderRadius: 10,
    display:'flex',
    flexDirection:'row',
    elevation:3,
    width:'98%',
    alignSelf:'center',
    marginBottom:5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
