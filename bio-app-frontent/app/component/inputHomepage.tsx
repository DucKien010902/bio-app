// TypingInput.native.jsx
import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const TypingInput = () => {
  const [placeholder, setPlaceholder] = useState('');
  const fullText = useRef('Tìm kiếm dịch vụ xét nghiệm');
  const indexRef = useRef(0);
  const isDeletingRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const type = () => {
      const text = fullText.current;
      const i = indexRef.current;
      const isDeleting = isDeletingRef.current;

      if (!isDeleting) {
        setPlaceholder(text.substring(0, i + 1));
        indexRef.current += 1;
        if (indexRef.current === text.length) {
          isDeletingRef.current = true;
          timeoutRef.current = setTimeout(type, 1500);
          return;
        }
      } else {
        setPlaceholder(text.substring(0, i - 1));
        indexRef.current -= 1;
        if (indexRef.current === 0) {
          isDeletingRef.current = false;
        }
      }

      timeoutRef.current = setTimeout(type, 100);
    };

    type();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <View style={styles.container}>
      <AntDesign name="search1" size={20} color="gray" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="gray"
      />
    </View>
  );
};

export default TypingInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 16,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 42,
    fontSize: 16,
    paddingVertical: 0,
  },
});
