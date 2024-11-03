import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, Alert, SafeAreaView, useColorScheme, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { db, storage } from '../../app/config/firebaseConfig';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const MAX_FILE_SIZE_MB = 3; // Maximum file size in MB

const PQ4: React.FC = () => {
    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? 'white' : '#000000';
    const backgroundColor = colorScheme === 'dark' ? 'black' : 'white';

    const [copyOfFirmFinancialStatement, setCopyOfFirmFinancialStatement] = useState<any>(null);
    const [copyOfCreditPosition, setCopyOfCreditPosition] = useState<any>(null);
   
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false); // Loading state for uploads
    const [totalPoints, setTotalPoints] = useState(0);
    const bottomSheetModalRef = useRef(null);
    
    // Set bottom sheet snap points
    const snapPoints = useMemo(() => ['40%', '45%'], []);

    // Show the bottom sheet
    const openBottomSheet = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setUserEmail(user.email);
        }
    }, []);

    useEffect(() => {
        const fetchUploadedDocuments = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const userEmail = user.email;
                const q = query(collection(db, 'PQ4'), where('email', '==', userEmail));
                const querySnapshot = await getDocs(q);
                const documents: any[] = [];
                querySnapshot.forEach((doc) => {
                    documents.push({ id: doc.id, ...doc.data() });
                });
                setUploadedDocuments(documents);
                setTotalPoints(calculatePoints(getLatestDocuments(documents)));
            }
        };

        fetchUploadedDocuments();
    }, []);

    const selectFile = async (setFile: React.Dispatch<React.SetStateAction<any>>, fieldName: string) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedFile = result.assets[0];
                const fileSizeMB = selectedFile.size ? selectedFile.size / (1024 * 1024) : 0;

                if (fileSizeMB > MAX_FILE_SIZE_MB) {
                    Alert.alert(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`);
                    return;
                }

                setFile(selectedFile);
            } else {
                setFile(null); 
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to select a document.');
        }
    };

    const uploadFiles = async () => {
        if (!userEmail) {
            Alert.alert('User not authenticated.');
            return;
        }

        setLoading(true); // Set loading state to true

        try {
            const uploadData: any = {
                email: userEmail,
                createdAt: serverTimestamp(),
            };

            const handleFileUpload = async (file: any, fieldName: string) => {
                if (file) {
                    const response = await fetch(file.uri);
                    const blob = await response.blob();
                    const storageRef = ref(storage, `pq1/${file.name}`);
                    await uploadBytes(storageRef, blob);
                    const downloadURL = await getDownloadURL(storageRef);

                    uploadData[`${fieldName}_name`] = file.name;
                    uploadData[`${fieldName}_uri`] = downloadURL;

                    Toast.show({
                        type: 'success',
                        position: 'top',
                        text1: 'File uploaded successfully:',
                        text2: file.name,
                    });
                } else {
                    uploadData[`${fieldName}_name`] = "N/A";
                    uploadData[`${fieldName}_uri`] = "N/A";
                }
            };

            await Promise.all([
                handleFileUpload(copyOfFirmFinancialStatement, 'copyOfFirmFinancialStatement'),
                handleFileUpload(copyOfCreditPosition, 'copyOfCreditPosition'),
               
            ]);

            await addDoc(collection(db, 'PQ1'), uploadData);

            setCopyOfFirmFinancialStatement(null);
            setCopyOfCreditPosition(null);
            

            const updatedDocuments = [...uploadedDocuments, uploadData];
            setUploadedDocuments(updatedDocuments);
            setTotalPoints(calculatePoints(getLatestDocuments(updatedDocuments)));
        } catch (error) {
            Alert.alert('Error uploading files:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const getLatestDocuments = (documents: any[]) => {
        const latestDocuments: any = {};
        documents.forEach((doc) => {
            Object.keys(doc).forEach((field) => {
                if (field.endsWith('_name') && doc[field] !== 'N/A') {
                    latestDocuments[field] = doc;
                }
            });
        });
        return latestDocuments;
    };

    const calculatePoints = (latestDocs: any) => {
        let points = 0;
        Object.values(latestDocs).forEach(doc => {
            if (doc && doc.name !== "N/A") {
                points += 1; // Each valid document earns 1 point
            }
        });
        return points;
    };

    const renderLatestDocument = (fieldName: string) => {
        const document = uploadedDocuments.find((doc) => doc[`${fieldName}_name`] && doc[`${fieldName}_name`] !== 'N/A');
        return document ? document[`${fieldName}_name`] : 'N/A';
    };

    const renderFileSelection = (file: any, setFile: React.Dispatch<React.SetStateAction<any>>, fieldName: string) => {
        return (
            <View style={styles.fileSelectionContainer}>
                <Text style={{ color: textColor }}>{`${fieldName.replace(/([A-Z])/g, ' $1')}: ${file ? file.name : 'N/A'}`}</Text>
                <View style={styles.fileSelectionButtons}>
                    <TouchableOpacity style={styles.selectButton} onPress={() => selectFile(setFile, fieldName)}>
                        <Text style={styles.buttonText}>Choose</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selectButton} onPress={() => setFile(null)}>
                        <Text style={styles.buttonText}>N/A</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ height: '100%', width: '100%', backgroundColor }}>
            <BottomSheetModalProvider>
                <View>
                   
                    <View style={styles.documentContainer}>
                        <Text style={{ color: textColor }}>{`Total Points: ${totalPoints}`}/6 </Text>
                        <Text style={{ color: textColor }}>{`Copy Of Firm Financial Statement: ${renderLatestDocument('CopyOfFirmFinancialStatement')}`} </Text>
                        <Text style={{ color: textColor }}>{`Copy Of Credit Position: ${renderLatestDocument('CopyOfCreditPosition')}`} </Text>
                        
                    </View>
                    <View>
                        <Text style={{ fontWeight: 'bold', color: textColor, textAlign: 'center', fontSize: 16 }}>Upload New Documents</Text>
                        {renderFileSelection(copyOfFirmFinancialStatement, setCopyOfFirmFinancialStatement, 'CopyOfFirmFinancialStatement')}
                        {renderFileSelection(copyOfCreditPosition, setCopyOfCreditPosition, 'CopyOfCreditPosition')}
                        

                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <TouchableOpacity style={styles.uploadButton} onPress={uploadFiles}>
                                <Text style={styles.buttonText}>Upload</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity  onPress={openBottomSheet}>
                        <Text style={{fontSize:10,color:'tomato', textAlign:'center', marginTop:10}}>Why are these documents important? </Text>
                    </TouchableOpacity>
                    <BottomSheetModal ref={bottomSheetModalRef} index={1} snapPoints={snapPoints}>
                        <View style={styles.contentContainer}>
                            <Text style={{ textAlign: 'center' }}>Hello!</Text>
                        </View>
                    </BottomSheetModal>
                </View>
            </BottomSheetModalProvider>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    documentContainer: {
        marginVertical: 1,
    },
    fileSelectionContainer: {
        marginVertical: 5,
    },
    fileSelectionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width:'80%',
        alignContent:'center',
        alignItems:'center',
        marginHorizontal:'10%'
    },
    selectButton: {
        padding: 5,        backgroundColor: '#007BFF',
        borderRadius: 5,
        marginTop: 5,
        width:110
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
    },
    uploadButton: {
        padding: 15,
        backgroundColor: '#28A745',
        borderRadius: 5,
        marginTop: 10,
    },
});

export default PQ4;
