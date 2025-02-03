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
import database from '@react-native-firebase/database'
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import RNFS from 'react-native-fs'; // react native file system의 약어



function board() {

    // 이미지 URL 상태 관리
    const [imgUrls, setImgUrls] = useState([]);
    // 선택한 이미지 파일
    const [fileName, setFileName] = useState(null)

    // 카메라 및 갤러리 권한 상태
    const [camChk, setCamChk] = useState(false);
    const [galChk, setGalChk] = useState(false);

    // 목록 상태 관리
    const [datas, setDatas] = useState([])

    // modal select 관리
    const [selectedValue, setSelectedValue] = useState("");
    
     // 현재 열려 있는 게시글 ID
    const [expandedId, setExpandedId] = useState(null);

    // 글쓰기 목록 불러오기
    const dataList = () => {
        const listRef = database().ref('board')
        listRef.on('value', snapshot=>{
            const data = snapshot.val()
            let arr = []

            for(const key in data){
                const regString = data[key].regdate
                const regStringDate = new Date(regString)
                const year = regStringDate.getFullYear()
                const month = (regStringDate.getMonth() + 1).toString().padStart(2, '0')
                const date = regStringDate.getDate()
                
                const regDate = `${year}.${month}.${date}`
                
                arr.push({id:key, regDate:regDate, ...data[key]})
            }

            setDatas(arr)
            // console.log('데이터리스트:', arr)
        })
    }

    useEffect(() => {
        dataList();
    }, []);

    // 아코디언 토글 함수
    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id); // 이미 열려 있으면 닫고, 닫혀 있으면 열기
    };

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

                    const fName = res.assets[0].fileName;
                    setFileName(fName);
                    console.log('파일명 : ', fName)
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
    const [modalVisible, setModalVisible] = useState(false); // 글쓰기 모달 표시 여부
    const [editModalVisible, setEditModalVisible] = useState(false); // 수정 모달 표시 여부

    const [title, setTitle] = useState(''); // 제목
    const [content, setContent] = useState(''); // 내용

    const [editContent, setEditContent] = useState(''); // 수정할 내용 초기 상태

    const [permissionsChecked, setPermissionsChecked] = useState(false); // 권한 체크 여부

    // 모달 활성화 후 권한 확인
    useEffect(()=>{
        if(modalVisible && !permissionsChecked){
            // 권한 요청 (컴포넌트가 처음 렌더링될 때)
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
            setPermissionsChecked(true); // 권한 체크 후 true로 변경
        }
        if(modalVisible){
            setExpandedId(null)
        }
    },[modalVisible])

    // 게시글 추가 함수
    const addPost = async () => {
        if (selectedValue == 'null'|| selectedValue == '' || !content || !title) {
            Alert.alert('알림', '모든 내용을 입력해주세요.');
            return;
        }

        const boardRef = database().ref('board').push()
        boardRef.set({
            title,
            content,
            selected: selectedValue,
            imgUrl: imgUrls, // 이미지 URL 추가
            regdate: new Date().toISOString(),
        })

        // 앱 특정 폴더 지정
        const appFolderPath = RNFS.DocumentDirectoryPath+"/boardImg"; // 현재 앱 위치+"/저장하고 싶은 위치"
        // 저장될 파일 경로
        const fPath = appFolderPath+"/"+fileName
        console.log('path', fPath)

        try{
            // 폴더가 없으면 폴더 생성
            const fis = await RNFS.exists(appFolderPath)
            if(!fis){
                await RNFS.mkdir(appFolderPath)
            }

            for (const uri of imgUrls) {
                const fileName = uri.split('/').pop(); // 파일명 추출
                const fPath = `${appFolderPath}/${fileName}`;
                console.log('path', fPath);
    
                // 파일 복사
                await RNFS.copyFile(uri, fPath);
                console.log('파일저장성공 : ', fileName);
            }
        }catch(error){
            console.log('파일저장실패 : ', error)
        }

        setSelectedValue('null'); // select 내용 초기화
        setTitle('');
        setContent('');
        setImgUrls([]); // 이미지 초기화
        setModalVisible(false); // 모달 닫기
        setExpandedId(null)
    };

    // 게시글 삭제 함수
    const deletePost = (id) => {
        Alert.alert(
            "게시글 삭제",
            "정말 삭제하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel",
                },
                {
                    text: "삭제",
                    onPress: async () => {
                        try {
                            // 해당 ID에 맞는 데이터 찾기
                            const postToDelete = datas.find((item) => item.id === id);

                            console.log(postToDelete)

                            if (postToDelete && postToDelete.imgUrl && postToDelete.imgUrl.length > 0) {
                                for (const imgPath of postToDelete.imgUrl) {
                                    const appFolderPath = RNFS.DocumentDirectoryPath+"/boardImg";
                                    const fileName = imgPath.split('/').pop(); // 파일명 추출
                                    const fPath = `${appFolderPath}/${fileName}`;

                                    console.log('path:',fPath)
    
                                    // 파일 존재 여부 확인 후 삭제
                                    const fileExists = await RNFS.exists(fPath);
                                    if (fileExists) {
                                        await RNFS.unlink(fPath);
                                        console.log(`파일 삭제됨: ${fPath}`);
                                    } else {
                                        console.log(`파일이 존재하지 않음: ${fPath}`);
                                    }
                                }
                            }
    
                            // Firebase에서 게시글 삭제
                            const boardRef = database().ref(`/board/${id}`);
                            await boardRef.remove();
    
                            Alert.alert('게시글 삭제', '삭제되었습니다.');
                        } catch (error) {
                            console.log("삭제 중 오류 발생:", error);
                        }
                    },
                    style: "destructive",
                },
            ],
            { cancelable: false } // 바깥 터치로 닫기 방지
        );
    };

    const cancelPost = () => {
        setSelectedValue('null')
        setTitle('')
        setContent('')
        setImgUrls([]);
        setModalVisible(false)
        setExpandedId(null)
        setEditModalVisible(false)
    }

    // 수정버튼 클릭 시
    const modifyPost = (item) => {
        setEditContent({ ...item }); // 수정하려는 아이템을 editContent로 설정
        setEditModalVisible(true);
    };
    
    const editPost = async (id) => {
        const noticeRef = database().ref(`/board/${id}`);
    
        try {
            await noticeRef.update({
                selected: editContent.selected,
                title: editContent.title,
                content: editContent.content,
                update: new Date().toISOString(),
            });
    
            Alert.alert("수정 완료", "게시글이 수정되었습니다.");
            setEditModalVisible(false); // 수정 후 모달 닫기
            setExpandedId(null); // 선택된 아코디언 접기
        } catch (error) {
            console.error("수정 중 오류 발생:", error);
            Alert.alert("수정 실패", "게시글 수정 중 오류가 발생했습니다.");
        }
    };

    // 이미지 삭제
    const handleDeleteImage = (index) => {
        // 해당 인덱스의 이미지를 배열에서 제거
        setImgUrls((prevUrls) => prevUrls.filter((_, idx) => idx !== index));
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={datas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={()=>{toggleExpand(item.id)}}>
                        <View style={styles.post}>
                            <Text>{item.selected}</Text>
                            <Text style={styles.postTitle}>{item.title}</Text>
                            <Text>{item.regDate}</Text>
                            
                            {/* 아코디언 내용 */}
                            {expandedId === item.id && (
                                <View style={styles.expandedContent}>
                                    <Text style={styles.postContent}>{item.content}</Text>
                                    
                                    {/* 이미지 표시 */}
                                    {item.imgUrl && item.imgUrl.map((uri, idx) => (
                                        <Image
                                            key={idx}
                                            source={{ uri }}
                                            style={{ width: 200, height: 200, marginTop: 20 }}
                                        />
                                    ))}

                                    <View style={styles.buttonContainer}>
                                        {/* 수정 버튼 */}
                                        <TouchableOpacity
                                            style={styles.modifyButton}
                                            onPress={() => modifyPost(item)}
                                        >
                                            <Text style={styles.modifyButtonText}>수정</Text>
                                        </TouchableOpacity>
                                        {/* 삭제 버튼 */}
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => deletePost(item.id)}
                                        >
                                            <Text style={styles.deleteButtonText}>삭제</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>게시글이 없습니다.</Text>
                }
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.addButtonText}>문의하기</Text>
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
                        <ScrollView style={{ maxHeight: 600 }}>
                            <Text style={styles.modalTitle}>문의</Text>
                            <Picker
                            style={styles.pickerStyle}
                            selectedValue={selectedValue}
                            onValueChange={(itemValue) => setSelectedValue(itemValue)}
                            >
                                <Picker.Item label="문의 유형 선택" value="null" enabled={false} />
                                <Picker.Item label="상품" value="상품" />
                                <Picker.Item label="배송" value="배송" />
                                <Picker.Item label="반품/환불" value="반품/환불" />
                                <Picker.Item label="교환/변경" value="교환/변경" />
                                <Picker.Item label="기타" value="기타" />
                            </Picker>
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
                                <View key={idx} style={styles.imgWrap}>
                                    <Image
                                        source={{ uri }}
                                        style={{ width: 200, height: 200, marginTop: 20 }}
                                    />
                                    <TouchableOpacity style={styles.imgDelBtn} onPress={() => handleDeleteImage(idx)}>
                                        <Text style={styles.deleteText}>x</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                            <View style={styles.modalButtons}>
                                <Button title="취소" onPress={cancelPost} />
                                <Button title="카메라" onPress={openCamera} />
                                <Button title="갤러리" onPress={openGallery} />
                                <Button title="등록" onPress={addPost} />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* 수정 모달 */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView style={{ maxHeight: 600 }}>
                            <Text style={styles.modalTitle}>수정</Text>
                            <Picker
                            style={styles.pickerStyle}
                            selectedValue={editContent.selected}
                            onValueChange={(itemValue) => setEditContent((prevContent) => ({ ...prevContent, selected: itemValue }))}
                            >
                                <Picker.Item label="문의 유형 선택" value="null" enabled={false} />
                                <Picker.Item label="상품" value="상품" />
                                <Picker.Item label="배송" value="배송" />
                                <Picker.Item label="반품/환불" value="반품/환불" />
                                <Picker.Item label="교환/변경" value="교환/변경" />
                                <Picker.Item label="기타" value="기타" />
                            </Picker>
                            <TextInput
                                style={styles.input}
                                placeholder="제목을 입력하세요"
                                value={editContent.title}
                                onChangeText={(text)=>setEditContent((prevContent)=>({...prevContent, title:text}))}
                            />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="내용을 입력하세요"
                                value={editContent.content}
                                onChangeText={(text)=>setEditContent((prevContent)=>({...prevContent, content:text}))}
                                multiline
                            />
                            {/* 모달 내 이미지 표시 */}
                            {editContent.imgUrl && editContent.imgUrl.map((uri, idx) => (
                                <Image
                                    key={idx}
                                    source={{ uri }}
                                    style={{ width: 200, height: 200, marginTop: 20 }}
                                />
                            ))}
                            <View style={styles.modalButtons}>
                                <Button title="취소" onPress={cancelPost} />
                                <Button title="카메라" onPress={openCamera} />
                                <Button title="갤러리" onPress={openGallery} />
                                <Button title="수정" onPress={()=>editPost(editContent.id)} />
                            </View>
                        </ScrollView>
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
    expandedContent: {
        backgroundColor: '#fff',
        padding: 15,
        marginTop: 5,
        borderRadius: 8,
    },
    postContent: {
        fontSize: 14,
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // 오른쪽 정렬
        gap: 10, // 버튼 간격 조정 (React Native 0.71 이상 지원)
    },
    modifyButton: {
        marginTop: 10,
        backgroundColor: '#007bff',
        padding: 5,
        borderRadius: 5,
        alignSelf: 'flex-end',
        
    },
    modifyButtonText: {
        color: '#fff',
        fontSize: 12,
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
    modalTitle:{
        fontWeight:'bold',
        fontSize:20,
        textAlign:'center',
        marginBottom:10
    },
    pickerStyle:{
        display:'block',
        borderWidth:1,
        borderColor:'#333'
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
    imgWrap: {
        position: 'relative',
    },
    imgDelBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'transparent',
        padding: 10,
    },
    deleteText: {
        color: 'white',
        fontSize: 18,
    },
});

export default board;
