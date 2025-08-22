import TypingInput from '@/app/component/inputHomepage';
import { AntDesign, Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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
import { Avatar } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import YoutubePlayer from 'react-native-youtube-iframe';
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
  const { width } = Dimensions.get('window');
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
                    <TouchableOpacity
                      key={index}
                      style={styles.serviceCard}
                      onPress={() => {
                        router.push('/(tabs)/home/booking');
                      }}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={item.image}
                        style={styles.cardImage}
                        resizeMode="contain"
                      />
                      <Text style={styles.cardTitle}>{item.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </ImageBackground>
            <View style={styles.container1}>
              <Carousel
                loop
                autoPlay
                autoPlayInterval={3000}
                width={width * 0.95} // 90% màn hình
                height={(width * 0.95 * 2) / 5} // ví dụ giữ tỷ lệ 16:9
                data={bannerImagesMobile}
                renderItem={({ item, index }) => (
                  <View key={index} style={styles.slide}>
                    <Image source={{ uri: item }} style={styles.image1} />
                  </View>
                )}
              />
            </View>
            <LinearGradient
              colors={['white', '#e8f8fd', '#e8f8fd', 'white']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.gradient2}
            >
              <Text style={styles.title2}>Cơ sở y tế được yêu thích</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer2}
              >
                {clinicList.map((clinic, i) => (
                  <View key={i} style={styles.card2}>
                    {/* Logo */}
                    <View style={styles.logoWrapper2}>
                      <Image
                        source={{
                          uri: 'https://www.thanhcongclinic.com/images/logo.png',
                        }}
                        style={styles.logo2}
                        resizeMode="contain"
                      />
                    </View>

                    {/* Name + Verified */}
                    <View style={styles.nameRow2}>
                      <Text style={styles.name2}>
                        {clinic.name}
                        {'  '}
                        {clinic.verified && (
                          <AntDesign
                            name="checkcircle"
                            size={16}
                            color="#1890ff"
                            style={{ marginLeft: 0 }}
                          />
                        )}
                      </Text>
                    </View>

                    {/* Address */}
                    <Text
                      style={styles.address2}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      <Entypo name="location-pin" size={16} color="#003553" />
                      {'  '}
                      {clinic.address}
                    </Text>

                    {/* Rating */}
                    <View style={styles.ratingRow2}>
                      <Text style={{ marginRight: 6 }}>(5)</Text>
                      {[...Array(clinic.rating)].map((_, idx) => (
                        <FontAwesome
                          key={idx}
                          name="star"
                          size={14}
                          color="#ffb54a"
                          style={{ marginRight: 2 }}
                        />
                      ))}
                    </View>

                    {/* Button */}
                    <TouchableOpacity
                      style={styles.button2}
                      onPress={() => {
                        router.push('/(tabs)/home/clinics');
                      }}
                    >
                      <Text style={styles.buttonText2}>Xem chi tiết</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </LinearGradient>
            <View
              style={{
                backgroundColor: 'white',
              }}
            >
              {/* Gradient background ở RN không hỗ trợ trực tiếp CSS, dùng expo-linear-gradient */}
              <View
                style={{
                  backgroundColor: '#e8f8fd',
                  paddingVertical: 20,
                }}
              >
                <Text style={styles.title3}>Các dịch vụ xét nghiệm</Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContainer3}
                >
                  {serviceList.map((service, i) => (
                    <View key={i} style={styles.cardWrapper3}>
                      <View style={styles.card3}>
                        {/* Ảnh */}
                        <Image
                          source={{ uri: service.image }}
                          style={styles.image3}
                          resizeMode="contain"
                        />

                        <View style={styles.content3}>
                          {/* Tên dịch vụ */}
                          <Text numberOfLines={2} style={styles.serviceName3}>
                            {service.name}{' '}
                            {service.verified && (
                              <AntDesign
                                name="checkcircle"
                                size={14}
                                color="#1890ff"
                              />
                            )}
                          </Text>

                          {/* Clinic */}
                          <View style={styles.row3}>
                            <Entypo
                              name="home"
                              size={15}
                              color="#003553"
                              style={{ marginRight: 6 }}
                            />
                            <Text style={styles.clinic3}>{service.clinic}</Text>
                          </View>

                          {/* Giá */}
                          <View style={styles.row3}>
                            <FontAwesome5
                              name="comment-dollar"
                              size={15}
                              color="#003553"
                              style={{ marginRight: 6 }}
                            />

                            <Text style={styles.price3}>
                              {service.price.toString()}.000đ
                            </Text>
                          </View>

                          {/* Button */}
                          <TouchableOpacity
                            style={styles.button3}
                            onPress={() => router.push('/(tabs)/home/booking')}
                          >
                            <Text style={styles.buttonText3}>
                              Đặt khám ngay
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
            <LinearGradient
              colors={['white', '#e8f8fd', '#e8f8fd', 'white']}
              style={styles.container4}
            >
              <Text style={styles.title4}>Cảm nhận từ khách hàng</Text>

              <View style={styles.card4}>
                <View style={styles.quote4}>
                  <FontAwesome name="quote-left" size={20} color="#ccc" />
                </View>

                <Text style={styles.feedbackText4}>
                  Đặt lịch xét nghiệm bên này rất gọn, có ngày giờ cụ thể luôn
                  lên là được xét nghiệm liền không rườm rà gì mấy. An tâm đặt
                  cho gia đình, có cả xét nghiệm tận nhà, không mất thời gian.
                </Text>

                <View style={styles.divider4} />

                <View style={styles.userRow4}>
                  <Avatar.Image
                    size={40}
                    source={{
                      uri: 'https://i.pinimg.com/736x/b7/91/44/b79144e03dc4996ce319ff59118caf65.jpg',
                    }}
                  />
                  <Text style={styles.userName4}>Kiên Nguyễn</Text>
                </View>
              </View>
            </LinearGradient>
            <View style={styles.container5}>
              <YoutubePlayer
                height={180}
                width={width * 0.9}
                play={false} // mặc định không tự động phát, đổi thành true nếu muốn autoplay
                videoId={'qb9kSd-e8_s'}
              />
            </View>
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
    // marginBottom: 24,
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
    marginTop: 20,
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
  container1: {
    width: '95%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  slide: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  image1: {
    width: '100%',
    height: '100%', // chiếm hết Carousel
    resizeMode: 'cover', // giống object-fit: cover
    // borderRadius: 5,
  },
  gradient2: {
    flex: 1,
    paddingVertical: 15,
  },
  title2: {
    fontWeight: '600',
    fontSize: 18,
    color: '#065c8c',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  scrollContainer2: {
    paddingHorizontal: 10,
  },
  card2: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 6,
    shadowColor: '#00bfff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  logoWrapper2: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logo2: {
    width: 150,
    height: 80,
  },
  nameRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  name2: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    lineHeight: 18, // chiều cao 1 dòng
    height: 18 * 2.5, // đúng 3 dòng
  },
  address2: {
    color: '#003553',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 18, // chiều cao 1 dòng
    height: 18 * 3, // đúng 4 dòng
  },

  ratingRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  button2: {
    backgroundColor: '#00bfff',
    borderRadius: 8,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText2: {
    color: 'white',
    fontWeight: 'bold',
  },
  title3: {
    fontWeight: '600',
    fontSize: 18,
    color: '#065c8c',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  scrollContainer3: {
    paddingHorizontal: 15,
  },
  cardWrapper3: {
    width: 200,
    marginRight: 12,
  },
  card3: {
    borderRadius: 16,
    backgroundColor: 'white',
    overflow: 'hidden',
    shadowColor: '#00bfff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  image3: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content3: {
    padding: 10,
  },
  serviceName3: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    height: 40, // đúng 2 dòng
    marginBottom: 8,
    color: '#000',
  },
  row3: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  clinic3: {
    color: '#003553',
    fontSize: 13,
    fontWeight: '500',
  },
  price3: {
    color: '#003553',
    fontSize: 15,
    fontWeight: '500',
  },
  button3: {
    backgroundColor: '#00bfff',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText3: {
    color: 'white',
    fontWeight: 'bold',
  },
  container4: {
    paddingVertical: 20,
  },
  title4: {
    fontSize: 18,
    marginVertical: 20,
    color: '#065c8c',
    textAlign: 'center',
    fontWeight: '600',
  },
  card4: {
    width: '90%',
    alignSelf: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f4f9fd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    alignItems: 'center',
    textAlign: 'center',
  },
  quote4: {
    fontSize: 24,
    color: '#ccc',
    marginBottom: 10,
  },
  feedbackText4: {
    fontSize: 16,
    color: '#2b4263',
    lineHeight: 24,
    textAlign: 'center',
  },
  divider4: {
    height: 1,
    backgroundColor: '#ddd',
    width: '90%',
    marginVertical: 16,
  },
  userRow4: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  userName4: {
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#2b4263',
  },
  container5: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
