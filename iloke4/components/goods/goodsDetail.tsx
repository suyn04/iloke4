import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import database from '@react-native-firebase/database';

function goodsDetail({ route }) {
    const { item } = route.params; // Goods에서 전달된 데이터
    const [comments, setComments] = useState([]); // 댓글 데이터
    const [newComment, setNewComment] = useState(''); // 새로운 댓글 입력값

    // Realtime Database에서 댓글 가져오기
    useEffect(() => {
        console.log('item.id:', item.id);
        const commentsRef = database().ref(`/comments/${item.id}`); // 상품 ID 기반 경로
        const onValueChange = commentsRef.on('value', (snapshot) => {
            const fetchedComments = [];
            snapshot.forEach((childSnapshot) => {
                fetchedComments.push({
                    id: childSnapshot.key, // 각 댓글의 고유 ID
                    ...childSnapshot.val(),
                });
            });
            setComments(fetchedComments.reverse()); // 최신 순으로 정렬
        });

        return () => commentsRef.off('value', onValueChange); // 리스너 정리
    }, [item.id]);

    // Realtime Database에 새로운 댓글 추가
    const handleAddComment = () => {
        if (newComment.trim() === '') return;

        const commentRef = database().ref(`/comments/${item.id}`).push();
        commentRef
            .set({
                text: newComment, // 댓글 내용
                createdAt: Date.now(), // 생성 시간 (타임스탬프)
            })
            .then(() => {
                setNewComment(''); // 입력 필드 초기화
            })
            .catch((error) => {
                console.error('댓글 추가 실패:', error);
            });
    };

    return (
        <View style={styles.container}>
            {/* 상품 정보 */}
            <View style={styles.card}>
                <Image source={item.image} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>

            {/* 댓글 작성 */}
            <View style={styles.commentInputContainer}>
                <TextInput
                    style={styles.commentInput}
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="댓글을 입력하세요..."
                />
                <TouchableOpacity style={styles.commentButton} onPress={handleAddComment}>
                    <Text style={styles.commentButtonText}>등록</Text>
                </TouchableOpacity>
            </View>

            {/* 댓글 목록 */}
            <FlatList
                data={comments}
                keyExtractor={(comment) => comment.id}
                renderItem={({ item }) => (
                    <View style={styles.commentItem}>
                        <Text style={styles.commentText}>{item.text}</Text>
                        <Text style={styles.commentDate}>
                            {new Date(item.createdAt).toLocaleString() || '방금 전'}
                        </Text>
                    </View>
                )}
                style={styles.commentList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        color: '#888',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    commentInput: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    commentButton: {
        marginLeft: 10,
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    commentButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    commentList: {
        marginTop: 10,
    },
    commentItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    commentText: {
        fontSize: 16,
        color: '#333',
    },
    commentDate: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
});

export default goodsDetail;
