import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import CodeEditor from './CodeEditor';

function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <CodeEditor />
      </SafeAreaView>
    </>
  );
}

export default App;
