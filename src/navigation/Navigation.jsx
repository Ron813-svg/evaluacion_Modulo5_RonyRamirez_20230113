import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../screens/Login';

const Stack = createNativeStackNavigator();

const navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} options={{title:'Login'}} />
            </Stack.Navigator>
        </NavigationContainer>
    )
} 

export default navigation;