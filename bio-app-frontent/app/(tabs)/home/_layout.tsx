import { Stack } from 'expo-router';

export default function HomeStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // ❌ Ẩn tên header
        animation: 'none', // ⚡ Chuyển trang không hiệu ứng
      }}
    />
  );
}
