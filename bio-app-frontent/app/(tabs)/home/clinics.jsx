import { Entypo, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import FooterComponent from '../../component/footer';
import HeaderComponent from '../../component/header';

const genbio1 = require('../../../assets/images/genbio1.jpg')
const ClinicListMobilePage = () => {
  const [clinics, setClinics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadClinics = async () => {
      try {
        const data = await AsyncStorage.getItem('allclinics');
        if (data) {
          const parsed = JSON.parse(data);
          const formatted = parsed.map((item, index) => ({
            id: index + 1,
            ID: item.ID,
            name: item.name,
            address: item.address,
            rating: item.rating || 0,
            image: item.mainImage || genbio1,
            descriptions: item.descriptions || ['Không có mô tả.'],
            mapEmbedUrl: item.mapEmbedUrl || '',
            isVerified: item.isVerified || false,
          }));
          setClinics(formatted);
        }
      } catch (error) {
        console.error('Lỗi khi đọc dữ liệu clinic từ localStorage:', error);
      }
    };

    loadClinics();
  }, []);

  const removeVietnameseTones = (str: string) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/\s+/g, '')
      .toLowerCase();

  const filteredClinics = clinics.filter((clinic) =>
    removeVietnameseTones(clinic.name).includes(
      removeVietnameseTones(searchTerm)
    )
  );

  // const handleNavigate = (screen: string, ID: string) => {
  //   navigation.navigate(screen as never, { ID } as never);
  // };

  return (
    <ScrollView style={styles.container}>
      <HeaderComponent/>
      <View style={styles.content}>
      <Text style={styles.title}>Cơ sở y tế</Text>
      <Text style={styles.subTitle}>
        Với những cơ sở y tế hàng đầu sẽ giúp bạn trải nghiệm khám, chữa bệnh tốt hơn
      </Text>

      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color="#ccc" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Tìm kiếm cơ sở y tế..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
      </View>

      {filteredClinics.map((clinic) => (
        <TouchableOpacity
          key={clinic.id}
          style={styles.card}
          onPress={() => handleNavigate('ClinicDetail', clinic.ID)}
        >
          <View style={styles.cardContent}>
            <Image source={{ uri: clinic.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.clinicName}>
                {clinic.name}
                {clinic.isVerified && (
                  <Ionicons name="checkmark-circle" size={16} color="#52c41a" style={{ marginLeft: 4 }} />
                )}
              </Text>
              <Text style={styles.address}>
                <Entypo name="location-pin" size={14} color="#888" /> {clinic.address}
              </Text>
              <View style={styles.ratingRow}>
                <Text style={{ color: '#f7c860' }}>{'★'.repeat(Math.floor(clinic.rating))}</Text>
                <Text style={{ marginLeft: 4, color: '#f760b6' }}>({clinic.rating})</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={(e) => {
                e.stopPropagation?.();
                handleNavigate('ClinicDetail', clinic.ID);
              }}
            >
              <Text style={styles.detailButtonText}>Xem chi tiết</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={(e) => {
                e.stopPropagation?.();
                handleNavigate('ClinicBooking', clinic.ID);
              }}
            >
              <Text style={styles.bookButtonText}>Đặt khám ngay</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
      </View>
      <FooterComponent/>
    </ScrollView>
  );
};

export default ClinicListMobilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4fd',
    // padding: 16,
  },
  content:{
    padding:16
  },
  title: {
    color: '#00b5f1',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subTitle: {
    textAlign: 'center',
    color: '#003553',
    fontSize: 14,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#5a52f3',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  clinicName: {
    fontWeight: 'bold',
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 13,
    color: '#666',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailButton: {
    borderWidth: 1,
    borderColor: '#00b5f1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: '45%',
  },
  detailButtonText: {
    color: '#00b5f1',
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: '#00b5f1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: '45%',
  },
  bookButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
