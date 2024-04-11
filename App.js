import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Button} from 'react-native';
import GetStarted from './components/GetStarted/GetStarted';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator , Header } from '@react-navigation/stack';
import WeatherInfoHome from "./components/WeatherUIHome/WeatherInfoHome";
import InputLocationModal from './modal/InputLocationModal';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();
const MyTheme = {
  colors: {
    border: '#011f4b',
  },
};

export default function App() {

  return (
    <>
    <StatusBar style='light'/>
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen name="Home" component={GetStarted} options={{
            title : '',
            headerStyle: {
              backgroundColor : '#011f4b'
            },
            cardStyle : {
              backgroundColor: '#011f4b',
            },
            }}/>
          <Stack.Screen name="WeatherHome" component={WeatherInfoHome} options={({ route }) => ({ title: route.params.title , headerTintColor : '#FFFF' })} />
        </Stack.Group>

        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="MyModal" component={InputLocationModal} />
        </Stack.Group>

      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#011f4b',
    justifyContent: 'center',
  },
});
