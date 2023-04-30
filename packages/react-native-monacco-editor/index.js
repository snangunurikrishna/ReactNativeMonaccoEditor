import React, {useRef, useState} from 'react';
import {Button, StyleSheet, View, Text} from 'react-native';
import WebView from 'react-native-webview';

const CodeEditor = () => {
  const webViewRef = useRef(null);

  const [messages, setMessages] = useState([]);

  const onMessage = event => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.command === 'consoleLog') {
      setMessages(prevMessages => [...prevMessages,data.data].slice(-5));
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
                  height: 95vh;
                  width: 100%;
                }
                #undoButton, #redoButton{
                  background-color: white;
                  color: orange;
                  border: none;
                  border-radius: 4px;
                  font-size: 20px;
                  font-weight: bold;
                  cursor: pointer;
                  outline: none;
                  margin-top: 5px;
                  margin-left: 5px;
                  height: 4vh;
                  margin-bottom: 10px;
                }
                #executeButton{
                  right: 10px;
                  background-color: white;
                  color: red;
                  border: none;
                  border-radius: 4px;
                  font-size: 20px;
                  font-weight: bold;
                  cursor: pointer;
                  outline: none;
                  margin-top: 10px;
                  margin-left: 10px;
                  height: 4vh;
                  margin-bottom: 10px;
                }
                 #openCurlyBracket, #lessThan,#greaterThan, #closeSquareBracket, #closeCurlyBracket,#openSquareBracket, #singleQuote, #doubleQuote,#closeParenthesis, #openParenthesis{
                  background-color: white;
                  color: black;
                  border: none;
                  border-radius: 4px;
                  font-size: 15px;
                  cursor: pointer;
                  outline: none;
                  margin-top: 10px;
                  margin-left: 8px;
                  height: 4vh;
                  margin-bottom: 10px;
                }
               
                .buttonsDiv {
                  display: flex;
                  width: 100%;
                }
                .undoRedoDiv{
                  background-color: white;
                  display:flex;
                  width:18%;
                  border-radius:1px
                }
                .icon {
                  display: inline-block;
                  vertical-align: middle;
                  width: 14px;
                  height: 14px;
                  margin-right: 4px;
                }
              </style>
            </head>
            <body>
            <div id="editor">
            <div class="buttonsDiv">
            <div class="undoRedoDiv">
            <div><button id="undoButton">⤹</button></div>
            <div><button id="redoButton">⤸</button></div>
            </div>
            <div><button id="openCurlyBracket">{</button></div>
            <div><button id="closeCurlyBracket">}</button></div>
            <div><button id="singleQuote">'</button></div>
            <div><button id="doubleQuote">"</button></div>
            <div><button id="openParenthesis">(</button></div>
            <div><button id="closeParenthesis">)</button></div>
            <div><button id="openSquareBracket">[</button></div>
            <div><button id="closeSquareBracket">]</button></div>
            <div><button id="lessThan"><</button></div>
            <div><button id="greaterThan">></button></div>
            <div><button id="executeButton">▶️</button></div>
            </div>
            
              
              <script>
                require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.27.0/min/vs' }});
                require(['vs/editor/editor.main'], function() {
                  window.editor = monaco.editor.create(document.getElementById('editor'), {
                    value: [
                      ' ',
                      'function helloWorld() {',
                      '  console.log("Hello, world!");',
                      '}',
                      ' ',
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

                  // Add this function to insert text at the cursor position
                function insertText(text) {
                  const position = window.editor.getPosition();
                  const range = new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column);
                  const id = { major: 1, minor: 1 };
                  const textModel = window.editor.getModel();
                  const op = { identifier: id, range, text, forceMoveMarkers: true };
                  textModel.pushEditOperations([], [op], () => null);
                  window.editor.focus();
                }

                // Update click event listeners for each button
                document.getElementById('redoButton').addEventListener('click', function() {
                  window.editor.trigger('', 'redo', '');
                });
                document.getElementById('undoButton').addEventListener('click', function() {
                  window.editor.trigger('', 'undo', '');
                });
                document.getElementById('openCurlyBracket').addEventListener('click', function() {
                  insertText('{');
                });
                document.getElementById('closeCurlyBracket').addEventListener('click', function() {
                  insertText('}');
                });
                document.getElementById('singleQuote').addEventListener('click', function() {
                  insertText("'");
                });
                document.getElementById('doubleQuote').addEventListener('click', function() {
                  insertText('"');
                });
                document.getElementById('openParenthesis').addEventListener('click', function() {
                  insertText('(');
                });
                document.getElementById('closeParenthesis').addEventListener('click', function() {
                  insertText(')');
                });
                document.getElementById('openSquareBracket').addEventListener('click', function() {
                  insertText('[');
                });
                document.getElementById('closeSquareBracket').addEventListener('click', function() {
                  insertText(']');
                });
                document.getElementById('lessThan').addEventListener('click', function() {
                  insertText('<');
                });
                document.getElementById('greaterThan').addEventListener('click', function() {
                  insertText('>');
                });


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
        <Text style={styles.consoleEditorHeader}>Output</Text>
        {messages.map((message, index) => (
          <Text key={index} style={styles.messageText}>
            {message}
          </Text>
        ))}
      </View>
      <Button
      color="orange"
        onPress={() => {
          setMessages([]);
        }}
        title=" Clear Console"></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    height: '60%',
  },
  buttonContainer: {
    backgroundColor: '#1e88e5',
    // padding: 10,
    width: '100%', // Add this line to make the button container the same width as the editor
  },
  messagesContainer: {
    height: '30%',
    padding: 10,
    backgroundColor: 'white',
    overflowY: 'auto',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  consoleEditorHeader: {
    color: 'orange',
    fontWeight: 'bold',
    marginBottom: 15,
  },
});

module.exports = CodeEditor;
