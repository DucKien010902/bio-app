import FooterComponent from '@/app/component/footer';
import HeaderComponent from '@/app/component/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { Button, RadioButton } from 'react-native-paper';

const { width } = Dimensions.get('window');

const ServicePageMobile = () => {
  const navigation = useNavigation();
  const [testTypes, setTestTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await AsyncStorage.getItem('alltests');
        if (data) {
          setTestTypes(JSON.parse(data));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const removeVietnameseTones = (str) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();

  const getDisplayedServices = () => {
    let allServices =
      selectedCategory === 'all'
        ? testTypes.flatMap((type) =>
            type.packages.map((pkg) => ({
              ...pkg,
              typeName: type.typeName,
            }))
          )
        : testTypes
            .find((type) => type.typeName === selectedCategory)
            ?.packages.map((pkg) => ({
              ...pkg,
              typeName: selectedCategory,
            })) || [];

    if (searchTerm.trim()) {
      const keyword = removeVietnameseTones(searchTerm);
      allServices = allServices.filter((service) =>
        removeVietnameseTones(service.name).includes(keyword)
      );
    }

    return allServices;
  };

  const servicesToDisplay = getDisplayedServices();

  return (
    <ScrollView style={styles.container}>
        <HeaderComponent/>
        <View style={styles.content}>
      <Text style={styles.title}>Chọn loại dịch vụ</Text>

      <RadioButton.Group
        onValueChange={(value) => setSelectedCategory(value)}
        value={selectedCategory}
      >
        <View style={styles.radioItem}>
          <RadioButton value="all" />
          <Text>Tất cả</Text>
        </View>
        {testTypes.map((type) => (
          <View key={type.typeName} style={styles.radioItem}>
            <RadioButton value={type.typeName} />
            <Text>{type.typeName}</Text>
          </View>
        ))}
      </RadioButton.Group>

      <TextInput
        style={styles.input}
        placeholder="Tìm kiếm dịch vụ"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {loading ? (
        <Text>Đang tải dữ liệu...</Text>
      ) : servicesToDisplay.length === 0 ? (
        <Text>Không có dịch vụ nào</Text>
      ) : (
        servicesToDisplay.map((service, index) => (
          <View key={service.code} style={styles.card}>
            <Text style={styles.serviceName}>
              {index + 1}. {service.name}
            </Text>
            <Text style={styles.serviceDetail}>Lịch khám: {service.schedule}</Text>
            <Text style={styles.serviceDetail}>
              Trả kết quả: {service.turnaroundTime}
            </Text>
            <Text style={styles.servicePrice}>
              {service.price.toLocaleString('vi-VN')}₫
            </Text>
            <View style={styles.buttonGroup}>
              <Button
                mode="outlined"
                onPress={() => setSelectedService(service)}
              >
                Chi tiết
              </Button>
              <Button
                mode="contained"
                onPress={() =>
                  navigation.navigate('datlich', { code: service.code })
                }
              >
                Đặt khám
              </Button>
            </View>
          </View>
        ))
      )}

      {/* Modal chi tiết */}
      <Modal
        visible={!!selectedService}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedService(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>🩺 Mô tả chi tiết dịch vụ</Text>
            <ScrollView style={styles.modalContent}>
              <Text>
                {selectedService?.description || 'Không có mô tả cho dịch vụ này.'}
              </Text>
            </ScrollView>
            <Button mode="text" onPress={() => setSelectedService(null)}>
              Đóng
            </Button>
          </View>
        </View>
      </Modal>
      </View>
      <FooterComponent/>
    </ScrollView>
  );
};

export default ServicePageMobile;

const styles = StyleSheet.create({
  container: {
    // padding: 16,
    backgroundColor: '#e8f4fd',
    minHeight: '100%',
  },
  content:{padding:16},
  title: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    padding: 10,
    marginVertical: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  serviceName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  serviceDetail: {
    color: '#555',
    marginTop: 4,
  },
  servicePrice: {
    marginTop: 8,
    color: '#1890ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalContent: {
    marginBottom: 12,
  },
});
