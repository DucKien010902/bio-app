// PostList.js
import FooterComponent from '@/app/component/footer';
import HeaderComponent from '@/app/component/header';
import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const POSTS_PER_PAGE = 9;

export default function PostList() {
  const [allPosts, setAllPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const sheetUrl =
      'https://docs.google.com/spreadsheets/d/1Ia20k0PhB7fDFVx1xW46MZyzs3dBUBIZwM_DsEepmLA/gviz/tq?tqx=out:csv&gid=0';

    fetch(sheetUrl)
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const reversed = results.data.reverse();
            setAllPosts(reversed);
            setVisiblePosts(reversed.slice(0, POSTS_PER_PAGE));
            setLoading(false);
          },
        });
      });
  }, []);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const nextPosts = allPosts.slice(0, nextPage * POSTS_PER_PAGE);
    setVisiblePosts(nextPosts);
    setCurrentPage(nextPage);
  };

  const renderItem = ({ item }) => {
    const imageUrl = extractImageUrl(item.File);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelectedPost(item)}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : null}
        <Text style={styles.tag}>Tin y tế</Text>
        <Text numberOfLines={2} style={styles.title}>
          {item.Title}
        </Text>
        <Text numberOfLines={3} style={styles.content}>
          {item.Content}
        </Text>
        <Text style={styles.detailLink}>Xem chi tiết →</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#1677ff"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={visiblePosts}
          keyExtractor={(item, index) => item.postid || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 0 }}
          ListHeaderComponent={<HeaderComponent />}
          ListFooterComponent={() => (
            <>
              {visiblePosts.length < allPosts.length && (
                <View style={{ marginVertical: 20 }}>
                  <Button title="Xem thêm" onPress={handleLoadMore} />
                </View>
              )}
              <FooterComponent />
            </>
          )}
        />
      )}

      {/* Modal chi tiết */}
      <Modal
        visible={!!selectedPost}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedPost(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedPost(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalBox}>
                <TouchableOpacity
                  onPress={() => setSelectedPost(null)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeText}>×</Text>
                </TouchableOpacity>

                <ScrollView contentContainerStyle={{ padding: 16 }}>
                  {selectedPost && (
                    <>
                      {selectedPost.File ? (
                        <Image
                          source={{ uri: extractImageUrl(selectedPost.File) }}
                          style={styles.modalImage}
                        />
                      ) : null}
                      <Text style={styles.modalTitle}>
                        {selectedPost.Title}
                      </Text>
                      <Text style={styles.modalContent}>
                        {selectedPost.Content}
                      </Text>
                    </>
                  )}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

function extractImageUrl(file) {
  if (!file) return '';
  if (file.includes('vnexpress')) return file;
  const match = file.match(/\/d\/(.*?)\//);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return file;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    margin: 12,
    padding: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    height: 180,
    borderRadius: 6,
    marginBottom: 8,
  },
  tag: {
    color: '#fbae17',
    fontSize: 12,
    marginBottom: 4,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    color: '#555',
  },
  detailLink: {
    marginTop: 8,
    color: '#1677ff',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '95%',
    height: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: 10,
    zIndex: 10,
  },
  closeText: {
    fontSize: 28,
    color: '#333',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
});
