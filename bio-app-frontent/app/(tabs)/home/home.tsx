import TypingInput from '@/app/component/inputHomepage';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axiosClient from '../../../api/apiConfig';
import dichvu from '../../../assets/images/dichvu.png';
import dichvu1 from '../../../assets/images/dichvu1.png';
import dichvu2 from '../../../assets/images/dichvu2.png';
import imagehoptac1 from '../../../assets/images/hoptac1.webp';
import FooterComponent from '../../component/footer';
import HeaderComponent from '../../component/header';

const bannerImages = [
  'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F5ddb363f-8886-4b33-bde9-f57bec34a86b-care247-tro-ly-ca-nhan-ho-tro-nguoi-dan-di-kham.png&w=1200&q=100',
  'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fda64c9ee-fdd6-4a13-bc52-fe74255fc079-promote-vaccine-d.jpg&w=1200&q=100',
  'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F2ef4ca2e-7283-457f-a9c1-e7d9a08d94db-giai-phap-quan-ly-phong-mach.png&w=1200&q=100',
];
const bannerImagesMobile = [
  'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fb391767a-71b5-4b43-a50c-ee0956c52dff-promote-vaccine-m.jpg&w=828&q=100',
  'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fd748611c-3d49-4d5b-b22b-a5eca0fe390f-care247-tro-ly-ca-nhan-ho-tro-nguoi-dan-di-kham.png&w=828&q=100',
  'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F2ec142a8-0bc6-495d-a9bb-463dba4dec95-dat-kham-medpro-zalopay-mobile.jpg&w=828&q=100',
];

const clinicList = [
  {
    name: 'Trung tâm xét nghiệm GoLAB Hà Đông',
    address: ' Số 12 Trần Phú, Quận Hà Đông, Hà Nội',
    rating: 5,
    logo: imagehoptac1,
    verified: true,
    id: 'golab-hadong',
  },
  {
    name: 'Phòng xét nghiệm GoLAB Ba Đình',
    address: 'Số 10 Nguyễn Thái Học, Ba Đình, Hà Nội',
    rating: 5,
    logo: imagehoptac1,
    verified: true,
    id: 'golab-badinh',
  },
  {
    name: 'Phòng xét nghiệm GoLab Vĩnh Yên',
    address: 'Đinh Tiên Hoàng, Khai Quang, Vĩnh Yên, Vĩnh Phúc, Việt Nam',
    rating: 5,
    logo: imagehoptac1,
    verified: true,
    id: 'golab-vinhyen',
  },
  {
    name: 'Trung tâm xét nghiệm GoLAB Hòa Bình',
    address:
      'Số 83 Cù Chính Lan, phường Đồng Tiến, TP Hòa Bỉnh,  Tỉnh Hòa Bình, Hòa Bình',
    rating: 5,
    logo: imagehoptac1,
    verified: true,
    id: 'golab-hoabinh',
  },
  {
    name: 'Trung Tâm Nội Soi Tiêu Hoá Doctor Check',
    address: 'Quận 10, Thành phố Hồ Chí Minh',
    rating: 5,
    logo: imagehoptac1,
    verified: true,
  },
];
const serviceList = [
  {
    name: 'Xét nghiệm huyết thống cha - con',
    image:
      'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fcce223da-f510-40d2-9d96-21fcac5d4bd8-tiaaam_ngaaaa_-_banner_section_-_277x150_px_.png&w=640&q=75',
    clinic: 'Trung tâm nội soi tiêu hóa Doctor Check',
    verified: true,
    price: 3000,
    id: 'ADN01',
  },
  {
    name: 'Kiểm tra chức năng gan',
    image:
      'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fcce223da-f510-40d2-9d96-21fcac5d4bd8-tiaaam_ngaaaa_-_banner_section_-_277x150_px_.png&w=640&q=75',
    clinic: 'Trung tâm nội soi tiêu hóa Doctor Check',
    verified: true,
    price: 3000,
    id: 'SBH01',
  },
  {
    name: 'Sàng lọc trước sinh không xâm lấn',
    image:
      'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fcce223da-f510-40d2-9d96-21fcac5d4bd8-tiaaam_ngaaaa_-_banner_section_-_277x150_px_.png&w=640&q=75',
    clinic: 'Trung tâm nội soi tiêu hóa Doctor Check',
    verified: true,
    price: 3000,
    id: 'NIP01',
  },
  {
    name: 'Tiêm ngừa viêm gan B',
    image:
      'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fcce223da-f510-40d2-9d96-21fcac5d4bd8-tiaaam_ngaaaa_-_banner_section_-_277x150_px_.png&w=640&q=75',
    clinic: 'Trung tâm nội soi tiêu hóa Doctor Check',
    verified: true,
    price: 300,
  },
  {
    name: 'Tiêm ngừa viêm gan B',
    image:
      'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fcce223da-f510-40d2-9d96-21fcac5d4bd8-tiaaam_ngaaaa_-_banner_section_-_277x150_px_.png&w=640&q=75',
    clinic: 'Trung tâm nội soi tiêu hóa Doctor Check',
    verified: true,
    price: 300,
  },
];
const newsList = [
  {
    title: '5 dấu hiệu cảnh báo bệnh tiểu đường',
    image:
      'https://cdn.tgdd.vn//News/1405384//nhung-dau-hieu-nhan-som-nhan-biet-bi-tieu-duong-(2)-800x450.jpg',
  },
  {
    title: 'Cách phòng tránh đột quỵ mùa nắng nóng',
    image: 'https://bvdklangson.com.vn/sites/default/files/3333_0.jpg',
  },
  {
    title: 'Chăm sóc sức khỏe người cao tuổi',
    image:
      'https://cloudpro.vn/public/media/images/mo-hinh-cham-soc-suc-khoe-tai-nha1%402x-100.jpg',
  },
];
const TestScreen = () => {
  const fetchAllClinic = async () => {
    try {
      const res = await axiosClient.get('/clinic/fetchall');
      await AsyncStorage.setItem('allclinics', JSON.stringify(res.data));
    } catch (error) {
      console.log('Không thể lấy danh sách phòng khám');
    }
  };
  const fetchServices = async () => {
    try {
      const res = await axiosClient.get('/testservice/fetchall');
      await AsyncStorage.setItem('alltests', JSON.stringify(res.data));
    } catch (error) {
      console.error(error);
      console.log('Không thể tải dữ liệu dịch vụ');
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkModalShown = async () => {
      try {
        const hasShown = await AsyncStorage.getItem('gennovaxModalShown');
        if (!hasShown) {
          const timer = setTimeout(() => {
            setIsModalOpen(true);
            AsyncStorage.setItem('gennovaxModalShown', 'true');
          }, 2000); // hiện sau 2 giây
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Lỗi khi đọc AsyncStorage:', error);
      }
    };
    checkModalShown();
  }, []);

  useEffect(() => {
    fetchAllClinic();
    fetchServices();
  }, []);
  const handleClose = () => {
    setIsModalOpen(false);
  };
  const translateX = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const startAnim = () => {
      translateX.setValue(screenWidth);
      Animated.timing(translateX, {
        toValue: -screenWidth,
        duration: 10000,
        useNativeDriver: true,
      }).start(() => startAnim());
    };
    startAnim();
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <HeaderComponent />
      <>
        <Modal
          visible={isModalOpen}
          animationType="fade"
          transparent
          onRequestClose={handleClose}
        >
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPress={handleClose}
            >
              <View style={styles.modalBox}>
                {/* Nút X */}
                <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>

                {/* Nội dung */}
                <View style={styles.contentWrapper}>
                  {/* Header */}
                  <View style={styles.header}>
                    <Text style={styles.headerSmall}>
                      → ĐẶT LỊCH XÉT NGHIỆM TẠI NHÀ ←
                    </Text>
                    <Text style={styles.headerBig}>
                      DỊCH VỤ XÉT NGHIỆM TỔNG QUÁT GenNovaX
                    </Text>
                    <Text style={styles.headerGreen}>
                      NHANH CHÓNG - CHÍNH XÁC - AN TOÀN
                    </Text>
                  </View>

                  {/* Body */}
                  <View style={styles.body}>
                    {/* Cột trái */}
                    <View style={{ flex: 1 }}>
                      <View style={styles.btnRow}>
                        <TouchableOpacity
                          style={[styles.btn, { backgroundColor: '#0071bc' }]}
                          onPress={() => navigation.navigate('DanhSachDichVu')}
                        >
                          <Text style={styles.btnText}>Xem Gói Xét Nghiệm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.btn, { backgroundColor: '#00a859' }]}
                          onPress={() =>
                            navigation.navigate('DatLichXetNghiem')
                          }
                        >
                          <Text style={styles.btnText}>Đặt Ngay</Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.title}>
                        Dịch vụ xét nghiệm GenNovaX
                      </Text>
                      <Text style={styles.desc}>
                        Đội ngũ kỹ thuật viên y tế chuyên nghiệp, lấy mẫu tại
                        nhà, trả kết quả nhanh chóng qua ứng dụng.
                      </Text>
                    </View>

                    {/* Cột phải */}
                    <View style={{ flex: 1 }}>
                      <Image
                        source={{
                          uri: 'https://bvphusanct.com.vn/Portals/0/67d0390c86dc42821bcd.jpg',
                        }}
                        style={styles.image}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        <View style={styles.container}>
          <Animated.View
            style={{
              flexDirection: 'row',
              transform: [{ translateX }],
            }}
          >
            {/* Render text 2 lần để nối tiếp nhau */}
            {[...Array(2)].map((_, i) => (
              <Text
                key={i}
                style={styles.text}
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                📢 Đặt ngay để nhận được tư vấn sớm nhất
              </Text>
            ))}
          </Animated.View>
        </View>
        <View style={styles.mainContent}>
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Banner background */}
            <ImageBackground
              source={{
                uri: 'https://png.pngtree.com/thumb_back/fh260/background/20210326/pngtree-light-blue-cute-striped-baby-blue-background-image_594858.jpg',
              }}
              style={styles.banner}
              imageStyle={{ resizeMode: 'contain' }}
            >
              {/* Title */}
              <Text style={styles.title}>
                Kết nối Người Dân với Cơ sở & Dịch vụ Y tế hàng đầu
              </Text>

              {/* Search */}
              <TypingInput />

              {/* Service carousel */}
              <View style={styles.carouselWrapper}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.carouselContainer}
                >
                  {[
                    {
                      title: 'Xét nghiệm tổng quát',
                      image: dichvu,
                    },
                    {
                      title: 'Xét nghiệm máu',
                      image: dichvu1,
                    },
                    {
                      title: 'Xét nghiệm ADN huyết thống',
                      image: dichvu2,
                    },
                    {
                      title: 'Xét nghiệm dị tật thai nhi (NIPT)',
                      image: dichvu,
                    },
                    {
                      title: 'Xét nghiệm bệnh lây qua đường tình dục',
                      image: dichvu1,
                    },
                    {
                      title: 'Xét nghiệm miễn dịch',
                      image: dichvu2,
                    },
                    {
                      title: 'Xét nghiệm COVID-19 PCR',
                      image: dichvu,
                    },
                  ].map((item, index) => (
                    <View key={index} style={styles.serviceCard}>
                      <Image
                        source={item.image}
                        style={styles.cardImage}
                        resizeMode="contain"
                      />
                      <Text style={styles.cardTitle}>{item.title}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </ImageBackground>
          </View>
        </View>
      </>
      <FooterComponent />
    </ScrollView>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    // paddingBottom: 20,
  },
  container: {
    width: '100%',
    height: 36,
    backgroundColor: '#ffb54a',
    overflow: 'hidden', // vẫn cần để tạo marquee
    paddingTop: 6,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
    marginRight: 40,
    flexShrink: 0,
  },
  inner: {
    flexDirection: 'row',
    width: 'auto',
  },
  mainContent: {
    // marginTop: 160, // nếu cần
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: '#f0f2f5', // giống web
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalBox: {
    backgroundColor: '#fff',
    maxWidth: 500,
    width: '95%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  closeBtn: {
    position: 'absolute',
    top: -15,
    right: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  contentWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#e7f7ff',
    padding: 15,
    alignItems: 'center',
  },
  headerSmall: {
    color: '#0071bc',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
  },
  headerBig: {
    color: '#0071bc',
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 6,
    textAlign: 'center',
  },
  headerGreen: {
    color: '#00a859',
    fontWeight: 'bold',
    fontSize: 15,
  },
  body: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f9fcff',
    gap: 15,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  btn: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0071bc',
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
    color: '#534c4c',
    marginBottom: 14,
    fontWeight: '500',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  banner: {
    backgroundColor: '#def1f1ff',
    position: 'relative',
    width: '100%',
    padding: 12,
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  title: {
    fontWeight: '600',
    fontSize: 22,
    color: '#065c8c',
    marginTop: 10,
    marginBottom: 0,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  searchBox: {
    width: '50%',
    alignSelf: 'center',
    marginVertical: 16,
  },
  carouselWrapper: {
    width: '100%',
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  carouselContainer: {
    alignItems: 'center',
    gap: 16,
  },
  serviceCard: {
    width: 100,
    aspectRatio: 1 / 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: 50,
    height: 50,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '500',
    textAlign: 'center',
    color: '#065c8c',
  },
});
