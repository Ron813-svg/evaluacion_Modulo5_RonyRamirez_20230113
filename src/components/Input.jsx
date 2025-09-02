import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Input = ({
  label = "Campo",       
  value = "",                 
  onChangeText = () => {},
  error = "",
  icon = null,
  ...rest                
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute',
    left: icon ? 50 : 16,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#999', isFocused ? '#007bff' : '#666'],
    }),
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    zIndex: 1,
  };

  const containerStyle = [
    styles.container,
    isFocused && styles.containerFocused,
    error && styles.containerError,
  ];

  const inputStyle = [
    styles.input,
    icon && styles.inputWithIcon,
  ];

  return (
    <View style={styles.wrapper}>
      <View style={containerStyle}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={isFocused ? '#007bff' : '#999'}
            style={styles.icon}
          />
        )}
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>
        <TextInput
          style={inputStyle}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#999"
          {...rest}
        />
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={16}
            color="#dc3545"
            style={styles.errorIcon}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fff',
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerFocused: {
    borderColor: '#007bff',
    shadowColor: '#007bff',
    shadowOpacity: 0.3,
  },
  containerError: {
    borderColor: '#dc3545',
    shadowColor: '#dc3545',
  },
  icon: {
    marginLeft: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 8,
  },
  errorIcon: {
    marginRight: 4,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    flex: 1,
  },
});

export default Input;