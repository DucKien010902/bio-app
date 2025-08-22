import { closeMenuBio, openMenuBio } from '@/redux/slices/openMenuSlice';
import { useNavigation } from '@react-navigation/native';
import { router, usePathname } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import gennovaXLogo from '../../assets/images/GenApp logo.png';

const HeaderComponent = () => {
  const pathname= usePathname()
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const dispatch = useDispatch();
  const isOpenMenu = useSelector((state) => state.openMenu.IsOpenMenu);

  const handleLogoPress = () => {
    router.replace('/(tabs)/home');
  };

  const toggleMenu = () => {
    if (isOpenMenu) {
      // nếu đang mở thì đóng
      dispatch(closeMenuBio());
      router.push('/(tabs)/home/home'); // hoặc router.replace('/(tabs)/home') nếu muốn quay về home khi đóng
    } else {
      // nếu đang đóng thì mở
      dispatch(openMenuBio());
      router.push('/(tabs)/home/menu');
    }
  };
  // useEffect(()=>{
  //   return()=>{
  //     dispatch(closeMenuBio())
  //   }
  // },[])
  if (!isMobile) return null;

  return (
    <View>
      <View style={styles.paddingHeader}></View>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleLogoPress}
          style={styles.logoContainer}
          onPressOut={() => {
            router.push('/(tabs)/home/home');
          }}
        >
          <Image source={gennovaXLogo} style={styles.logo} resizeMode="contain" />
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          {/* Bell with badge */}
          <TouchableOpacity style={styles.iconWrapper}>
            <Feather name="bell" size={24} color="#1890ff" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>6</Text>
            </View>
          </TouchableOpacity>

          {/* Menu icon */}
          <TouchableOpacity onPress={toggleMenu}>
            <Icon name={isOpenMenu ? 'close' : 'bars'} size={28} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({
  paddingHeader: {
    height: 40,
    backgroundColor: 'black',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    height: 50,
    width: 100,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 12,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
