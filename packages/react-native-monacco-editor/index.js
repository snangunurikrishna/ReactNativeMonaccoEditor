import React, {useRef, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import WebView from 'react-native-webview';

const CodeEditor = () => {
  const webViewRef = useRef(null);

  const [messages, setMessages] = useState([]);

  const executeCode = () => {
    webViewRef.current.postMessage('executeCode');
  };

  const onMessage = event => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.command === 'consoleLog') {
      setMessages(prevMessages => [data.data]);
      console.log('WebView console.log:', data.data);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Monaco Editor</title>
              <script src="https://unpkg.com/monaco-editor@0.27.0/min/vs/loader.js"></script>
              <style>
                body, html, #editor {
                  margin: 0;
                  padding: 0;
                  height: 70vh;
                  width: 100%;
                }
                #executeButton {
                  top: 10px;
                  right: 10px;
                  background-color: #1e88e5;
                  color: white;
                  border: none;
                  padding: 10px 15px;
                  border-radius: 4px;
                  font-size: 14px;
                  cursor: pointer;
                  outline: none;
                  margin-top:10px;
                  margin-left:10px;
                  height: 8vh;
                }
                #executeButton:hover {
                  background-color: #1976d2;
                }
              </style>
            </head>
            <body>
            <div id="editor"></div>
              <button id="executeButton">Click here to execute the code</button>
              <script>
                require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.27.0/min/vs' }});
                require(['vs/editor/editor.main'], function() {
                  window.editor = monaco.editor.create(document.getElementById('editor'), {
                    value: [
                      'function helloWorld() {',
                      '  return "Hello, world!";',
                      '}',
                      'helloWorld();'
                    ].join('\\n'),
                    language: 'javascript',
                    theme: 'vs-dark'
                  });

                  const originalConsoleLog = console.log;
                  console.log = function() {
                    const args = Array.from(arguments).map(arg => JSON.stringify(arg));
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      command: 'consoleLog',
                      data: args.join(' ')
                    }));
                    originalConsoleLog.apply(console, arguments);
                  };

                  document.getElementById('executeButton').addEventListener('click', function() {
                    const code = window.editor.getValue();
                    try {
                      const script = new Function(code);
                      script();
                    } catch (error) {
                      console.error(error);
                    }
                  });
                });
              </script>
            </body>
            </html>
          `,
        }}
        onMessage={onMessage}
        style={styles.webview}
        useWebKit={true}
      />
      <View style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <Text key={index} style={styles.messageText}>
            {message}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: '#1e88e5',
    // padding: 10,
  },
  messagesContainer: {
    height: '20%',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
});

module.exports = CodeEditor;
