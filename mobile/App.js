import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import VideoScreen from "./screens/VideoScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "MeetYouLive" }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Vídeos" }}
        />
        <Stack.Screen
          name="Video"
          component={VideoScreen}
          options={{ title: "Reproductor" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
