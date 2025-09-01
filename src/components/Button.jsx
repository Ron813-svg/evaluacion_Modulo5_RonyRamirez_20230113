import * as React from 'react';
import { Button } from 'react-native-paper';

const Button = () => (
  <Button
    icon="camera"
    mode="contained"
    onPress={() => console.log('Botón presionado')}
  >
    Presionar
  </Button>
);

export default Button
