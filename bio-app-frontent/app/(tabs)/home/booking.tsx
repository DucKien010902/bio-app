import FooterComponent from '@/app/component/footer';
import HeaderComponent from '@/app/component/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import axiosClient from '../../../api/apiConfig'; // giữ nguyên cấu hình axios của bạn

// Nếu dùng React Navigation, nhận params qua route
const BookingPageMobile = ({ route, navigation }) => {
  const params = route?.params || {};
  const ID = params.ID || null;
  const code = params.code || null;

  // Lấy user từ AsyncStorage (nếu bạn lưu trước đó) — fallback là null
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const u = await AsyncStorage.getItem('user');
        if (u) setUser(JSON.parse(u));
      } catch (e) {
        console.warn('Không lấy được user', e);
      }
    };
    loadUser();
  }, []);

  // Form state
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format('YYYY-MM-DD')
  ); // ISO
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null); // string name
  const [selectedService, setSelectedService] = useState(null); // service code

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [address, setAddress] = useState(user?.address || '');
  const [dob, setDob] = useState(null); // YYYY-MM-DD
  const [email, setEmail] = useState(null); // YYYY-MM-DD

  const [allclinics, setAllclinics] = useState([]);
  const [services, setServices] = useState([]); // grouped: [{ typeName, packages: [{ code, name }] }]
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);

  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
  ];

  // Modal state for facility & service pickers
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('facility'); // 'facility' | 'service'

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res1 = await axiosClient.get('/clinic/fetchall');
        const res2 = await axiosClient.get('/testservice/fetchall');
        const datas1 = res1.data;
        const datas2 = res2.data;
        setAllclinics(datas1);

        const groupedServices = datas2.map((testType) => ({
          typeName: testType.typeName,
          packages: testType.packages.map((pkg) => ({
            code: pkg.code,
            name: pkg.name,
          })),
        }));
        setServices(groupedServices);

        // preset by ID or code from params (route)
        if (ID) {
          const matchedClinic = datas1.find((clinic) => clinic.ID === ID);
          if (matchedClinic) setSelectedFacility(matchedClinic.name);
        }
        if (code) {
          for (const testType of datas2) {
            const foundPkg = testType.packages.find((pkg) => pkg.code === code);
            if (foundPkg) {
              setSelectedService(foundPkg.code);
              break;
            }
          }
        }
      } catch (error) {
        console.error('Lỗi tải dữ liệu', error);
        Alert.alert('Lỗi', 'Không tải được dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [ID, code]);

  // Filter facilities & services when selection changes
  useEffect(() => {
    if (!allclinics || !services.length) return;

    const filteredClinics = selectedService
      ? allclinics.filter((clinic) =>
          clinic.listService.includes(selectedService)
        )
      : allclinics;
    setFilteredFacilities(filteredClinics.map((c) => c.name));

    let validServiceCodes = [];
    if (selectedFacility) {
      const clinic = allclinics.find((c) => c.name === selectedFacility);
      validServiceCodes = clinic?.listService || [];
    }

    const filtered = services
      .map((group) => ({
        typeName: group.typeName,
        packages: group.packages.filter((pkg) =>
          selectedFacility ? validServiceCodes.includes(pkg.code) : true
        ),
      }))
      .filter((group) => group.packages.length > 0);

    setFilteredServices(filtered);
  }, [selectedFacility, selectedService, allclinics, services]);

  const handleOpenModal = (mode) => {
    setModalMode(mode);
    setModalVisible(true);
  };

  const handleSelectFacility = (name) => {
    setSelectedFacility(name);
    setModalVisible(false);
    // clear selected service if not valid with new facility
    const clinic = allclinics.find((c) => c.name === name);
    if (clinic && !clinic.listService.includes(selectedService)) {
      setSelectedService(null);
    }
  };

  const handleSelectService = (code) => {
    setSelectedService(code);
    setModalVisible(false);
  };

  const validateAndSubmit = async () => {
    if (
      !fullName ||
      !phoneNumber ||
      !address ||
      !dob ||
      !selectedDate ||
      !selectedTime ||
      !selectedFacility ||
      !selectedService
    ) {
      Alert.alert(
        'Thiếu thông tin',
        'Vui lòng nhập đầy đủ thông tin cá nhân và lịch hẹn.'
      );
      return;
    }

    // find facility ID
    const selectedFacilityObj = allclinics.find(
      (c) => c.name === selectedFacility
    );
    const selectedFacilityID = selectedFacilityObj?.ID || null;

    // find service name
    let selectedServiceName = '';
    for (const group of services) {
      const found = group.packages.find((p) => p.code === selectedService);
      if (found) {
        selectedServiceName = found.name;
        break;
      }
    }

    const state = {
      date: dayjs(selectedDate).format('DD/MM/YYYY'),
      time: selectedTime,
      facility: selectedFacility,
      facilityID: selectedFacilityID,
      serviceCode: selectedService,
      serviceName: selectedServiceName,
      name: fullName,
      phone: phoneNumber,
      dob: dayjs(dob).format('DD/MM/YYYY'),
      location: address,
      confirmed: false,
    };

    try {
      setLoading(true);
      await axiosClient.post('/booking/addfirst', state);
      Alert.alert('Thành công', 'Đặt lịch thành công', [
        {
          text: 'OK',
          onPress: () => navigation?.navigate('BookingSuccess', { state }),
        },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể đặt lịch. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // markedDates for calendar
  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: '#1890ff',
    },
  };

  // Renderers
  const renderFacilityRow = ({ item }) => (
    <Pressable
      onPress={() => handleSelectFacility(item)}
      style={styles.optionRow}
    >
      <Text style={styles.optionText}>{item}</Text>
    </Pressable>
  );

  const renderServiceSection = ({ section }) => (
    <View style={{ paddingVertical: 8 }}>
      <Text style={styles.sectionHeader}>{section.title}</Text>
      {section.data.map((pkg) => (
        <Pressable
          key={pkg.code}
          onPress={() => handleSelectService(pkg.code)}
          style={styles.optionRow}
        >
          <Text style={styles.optionText}>{pkg.name}</Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <HeaderComponent />
        <View style={styles.card}>
          <Text style={styles.title}>Đặt lịch xét nghiệm</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Cơ sở xét nghiệm</Text>
            <TouchableOpacity
              style={styles.select}
              onPress={() => handleOpenModal('facility')}
            >
              <Text
                style={[
                  styles.selectText,
                  !selectedFacility && styles.placeholder,
                ]}
              >
                {selectedFacility || 'Chọn cơ sở'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Dịch vụ xét nghiệm</Text>
            <TouchableOpacity
              style={styles.select}
              onPress={() => handleOpenModal('service')}
            >
              <Text
                style={[
                  styles.selectText,
                  !selectedService && styles.placeholder,
                ]}
              >
                {selectedService
                  ? // show service name
                    services
                      .flatMap((g) => g.packages)
                      .find((p) => p.code === selectedService)?.name ||
                    selectedService
                  : 'Chọn dịch vụ'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Chọn ngày</Text>
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={markedDates}
              minDate={dayjs().format('YYYY-MM-DD')}
              theme={{
                selectedDayBackgroundColor: '#1890ff',
                todayTextColor: '#1890ff',
                arrowColor: '#1890ff',
                monthTextColor: '#082966',
                textDayFontWeight: '700',
              }}
            />
            <Text style={styles.selectedDateText}>
              Đã chọn: {dayjs(selectedDate).format('DD/MM/YYYY')}
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Chọn khung giờ</Text>
            <View style={styles.timeContainer}>
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.timeButton,
                    selectedTime === slot && styles.timeButtonActive,
                  ]}
                  onPress={() => setSelectedTime(slot)}
                >
                  <Text
                    style={[
                      styles.timeText,
                      selectedTime === slot && styles.timeTextActive,
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Thông tin cá nhân</Text>
            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Email liên hệ"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity
              style={styles.select}
              onPress={() => {
                // show simple date input via built-in prompt or another modal — for simplicity we set to today if null
                // You can replace with a DatePicker modal lib for a better UX
                const newDob = dayjs()
                  .subtract(20, 'year')
                  .format('YYYY-MM-DD');
                setDob(newDob);
                Alert.alert(
                  'Chọn ngày sinh',
                  'Demo: đã đặt ngày sinh tạm — bạn có thể tích hợp DatePicker modal',
                  [{ text: 'OK' }]
                );
              }}
            >
              <Text style={[styles.selectText, !dob && styles.placeholder]}>
                {dob ? dayjs(dob).format('DD/MM/YYYY') : 'Ngày sinh'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.bookingButton}
            onPress={validateAndSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.bookingButtonText}>Đặt lịch ngay</Text>
            )}
          </TouchableOpacity>
        </View>
        <FooterComponent />
      </ScrollView>

      {/* Modal for select options */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {modalMode === 'facility' ? 'Chọn cơ sở' : 'Chọn dịch vụ'}
            </Text>
            <View style={{ height: 12 }} />
            {modalMode === 'facility' ? (
              <FlatList
                data={filteredFacilities}
                keyExtractor={(i) => i}
                renderItem={renderFacilityRow}
              />
            ) : (
              <SectionList
                sections={filteredServices.map((g) => ({
                  title: g.typeName,
                  data: g.packages,
                }))}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelectService(item.code)}
                    style={styles.optionRow}
                  >
                    <Text style={styles.optionText}>{item.name}</Text>
                  </Pressable>
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <Text style={styles.sectionHeader}>{title}</Text>
                )}
              />
            )}

            <Pressable
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#1890ff', fontWeight: '700' }}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BookingPageMobile;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8f4fd' },
  card: {
    backgroundColor: '#fff',
    // borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#00b5f1',
    marginBottom: 12,
  },
  field: { marginBottom: 12 },
  label: { fontWeight: '700', marginBottom: 8, color: '#333' },
  select: {
    borderWidth: 1,
    borderColor: '#e6f4fb',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  selectText: { fontSize: 16 },
  placeholder: { color: '#999' },
  input: {
    borderWidth: 1,
    borderColor: '#e6f4fb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectedDateText: { marginTop: 8, color: '#4caf50', fontWeight: '700' },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-evenly',
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  timeButtonActive: {
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
  },
  timeText: { color: '#333', fontWeight: '700' },
  timeTextActive: { color: '#fff' },
  bookingButton: {
    marginTop: 8,
    backgroundColor: '#00b5f1',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  bookingButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 12,
    maxHeight: '70%',
  },
  modalTitle: { fontWeight: '700', fontSize: 16, marginBottom: 6 },
  optionRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: { fontSize: 16, fontWeight: '600' },
  sectionHeader: {
    fontWeight: '800',
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  modalClose: { alignSelf: 'center', padding: 12, marginTop: 8 },
});
