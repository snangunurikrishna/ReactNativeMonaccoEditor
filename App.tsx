

import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  // Button,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView, StatusBar } from 'react-native';
import CodeEditor from './CodeEditor';



function App() {
  

  return (
    <>
<StatusBar barStyle="dark-content" />
<SafeAreaView style={{ flex: 1 }}>
<CodeEditor />
</SafeAreaView>
</>
  );
}

const styles = StyleSheet.create({
 
});

export default App;
