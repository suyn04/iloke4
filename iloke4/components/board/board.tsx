import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

function board(props) {

    // 이미지 URL 상태 관리
    const [imgUrls, setImgUrls] = useState([]);

    // 카메라 및 갤러리 권한 상태
    const [camChk, setCamChk] = useState(false);
    const [galChk, setGalChk] = useState(false);

    // 권한 요청 (컴포넌트가 처음 렌더링될 때)
    useEffect(() => {
        const checkPermissions = async () => {
            const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
            const storagePermission = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

            if (cameraPermission === RESULTS.GRANTED) {
                setCamChk(true);
            } else {
                Alert.alert('권한필요', '카메라 권한이 필요합니다.');
            }

            if (storagePermission === RESULTS.GRANTED) {
                setGalChk(true);
            } else {
                Alert.alert('권한필요', '갤러리 권한이 필요합니다.');
            }
        };

        checkPermissions();
    }, []);

    // 카메라 열기
    const openCamera = async () => {
        if (!camChk) return;
        launchCamera(
            {
                mediaType: 'photo',
                cameraType: 'back',
                saveToPhotos: true,
                quality: 1,
            },
            (res) => {
                if (res.didCancel) {
                    console.log('카메라 취소');
                } else if (res.errorCode) {
                    console.log('카메라 에러', res.errorMessage);
                } else {
                    const uri = res.assets[0].uri;
                    setImgUrls((prev) => [...prev, uri]);
                }
            }
        );
    };

    // 갤러리 열기
    const openGallery = async () => {
        if (!galChk) return;
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 1,
            },
            (res) => {
                if (res.didCancel) {
                    console.log('갤러리 취소');
                } else if (res.errorCode) {
                    console.log('갤러리 에러', res.errorMessage);
                } else {
                    const uri = res.assets[0].uri;
                    setImgUrls((prev) => [...prev, uri]);
                }
            }
        );
    };

    // 게시글 목록 상태 관리
    const [posts, setPosts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); // 글쓰기 모달 표시 여부
    const [title, setTitle] = useState(''); // 제목
    const [content, setContent] = useState(''); // 내용

    // 게시글 추가 함수
    const addPost = () => {
        if (!title || !content) {
            Alert.alert('알림', '제목과 내용을 모두 입력해주세요.');
            return;
        }

        const newPost = {
            id: posts.length + 1,
            title,
            content,
            imgUrl: imgUrls, // 이미지 URL 추가
        };

        setPosts((prev) => [...prev, newPost]);
        setTitle('');
        setContent('');
        setImgUrls([]); // 이미지 초기화
        setModalVisible(false); // 모달 닫기
    };

    // 게시글 삭제 함수
    const deletePost = (id) => {
        setPosts((prev) => prev.filter((post) => post.id !== id));
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.post}>
                        <Text style={styles.postTitle}>{item.title}</Text>
                        <Text style={styles.postContent}>{item.content}</Text>
                        {/* 게시물에 이미지가 있으면 표시 */}
                        {item.imgUrl && item.imgUrl.map((uri, idx) => (
                            <Image
                                key={idx}
                                source={{ uri }}
                                style={{ width: 200, height: 200, marginTop: 20 }}
                            />
                        ))}
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => deletePost(item.id)}
                        >
                            <Text style={styles.deleteButtonText}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>게시글이 없습니다.</Text>
                }
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.addButtonText}>글쓰기</Text>
            </TouchableOpacity>

            {/* 글쓰기 모달 */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.input}
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="내용을 입력하세요"
                            value={content}
                            onChangeText={setContent}
                            multiline
                        />
                        {/* 모달 내 이미지 표시 */}
                        {imgUrls && imgUrls.map((uri, idx) => (
                            <Image
                                key={idx}
                                source={{ uri }}
                                style={{ width: 200, height: 200, marginTop: 20 }}
                            />
                        ))}
                        <View style={styles.modalButtons}>
                            <Button title="취소" onPress={() => setModalVisible(false)} />
                            <Button title="카메라" onPress={openCamera} />
                            <Button title="갤러리" onPress={openGallery} />
                            <Button title="등록" onPress={addPost} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    post: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    postContent: {
        fontSize: 14,
        color: '#333',
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: '#ff6b6b',
        padding: 5,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    emptyText: {
        textAlign: 'center',
        color: '#aaa',
        marginTop: 20,
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 30,
        position: 'absolute',
        bottom: 20,
        right: 20,
        elevation: 5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 10,
        elevation: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default board;
