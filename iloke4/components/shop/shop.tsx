import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import database from '@react-native-firebase/database';
// import { useNavigation } from '@react-navigation/native';

const shop = ({ navigation }) => {
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    // const navigation = useNavigation();
    //데이터불러오기
    useEffect(() => {
        const shopRef = database().ref('shop');
        const onValueChange = shopRef.on('value', (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const shopArray = Object.keys(data).map((key) => data[key]);
                setShops(shopArray);
            }
        });

        return () => shopRef.off('value', onValueChange);
    }, []);

    //모달창
    const openModal = (shop) => {
        setSelectedShop(shop);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedShop(null);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => openModal(item)} style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.address}>{item.address}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View>
                {/* <TouchableOpacity style={styles.maplmg} onPress={() => Alert.alert("뜬다")}> */}
                <TouchableOpacity style={styles.maplmg} onPress={() => navigation.navigate('주변매장찾기', { shops })}>
                    <Image
                        source={require("../image/shop/store.jpg")}
                        style={styles.icon}
                    />
                    {/* <Text style={styles.closeButtonText}>지도보기
                    googlemaps
                    </Text> */}
                </TouchableOpacity>
                <Text style={styles.title}>매장 리스트</Text>
                <FlatList
                    data={shops}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />

                {/* 모달 창 */}
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            {selectedShop && (
                                <>
                                    <Image
                                        source={require("../image/shop/store.jpg")}
                                        style={styles.image}
                                    />
                                    <Text style={styles.modalTitle}>{selectedShop.name}</Text>
                                    <Text style={styles.modalAddress}>{selectedShop.address}</Text>
                                    <Text style={styles.modaltime}>{selectedShop.time}</Text>
                                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                        <Text style={styles.closeButtonText}>닫기</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    icon: {
        width: 20,
        height: 20
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    address: {
        fontSize: 14,
        color: '#666',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    image: {
        width: 300,
        height: 150,
        borderRadius: 10,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalAddress: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
    modaltime: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    maplmg: {
        width: 50,
        backgroundColor: '#faf',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default shop;
