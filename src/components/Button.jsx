import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ButtonComponent = ({
  icon = "camera",          
  onPress = () => {},       
  children = "Presionar",   
  disabled = false,
  variant = "primary", 
  size = "medium", 
  ...rest                   
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    if (size === 'small') baseStyle.push(styles.buttonSmall);
    if (size === 'large') baseStyle.push(styles.buttonLarge);
    if (disabled) baseStyle.push(styles.buttonDisabled);
    
    return baseStyle;
  };

  const getGradientColors = () => {
    if (disabled) return ['#cccccc', '#999999'];
    
    switch (variant) {
      case 'secondary':
        return ['#6c757d', '#495057'];
      case 'danger':
        return ['#dc3545', '#c82333'];
      default:
        return ['#007bff', '#0056b3'];
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];
    
    if (size === 'small') baseStyle.push(styles.buttonTextSmall);
    if (size === 'large') baseStyle.push(styles.buttonTextLarge);
    if (disabled) baseStyle.push(styles.buttonTextDisabled);
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.8}
      style={styles.container}
      {...rest}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={getButtonStyle()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={size === 'large' ? 24 : size === 'small' ? 16 : 20}
              color="#fff"
              style={styles.icon}
            />
          )}
          <Text style={getTextStyle()}>{children}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
    borderRadius: 18,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
    borderRadius: 28,
  },
  buttonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  buttonTextLarge: {
    fontSize: 18,
  },
  buttonTextDisabled: {
    opacity: 0.7,
  },
});

export default ButtonComponent;