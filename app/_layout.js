import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name='home' 
        options={{ 
          title: 'Home', 
        }} 
      />
      <Stack.Screen 
        name='index' 
        options={{
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name='about' 
        options={{ 
          title: 'About', 
        }} 
      />
      <Stack.Screen 
        name='settings' 
        options={{ 
          title: 'Settings', 
        }} 
      />
      <Stack.Screen 
        name='profile' 
        options={{ 
          title: 'Profile', 
        }} 
      />
    </Stack>
  );
}