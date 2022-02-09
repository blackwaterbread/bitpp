import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import Theme from './lib/theme';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={Theme}>
      <ColorModeScript initialColorMode='dark' />
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);