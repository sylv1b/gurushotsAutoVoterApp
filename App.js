/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type { Node } from 'react';
import { setupAxios } from './src/utils/setAuthToken';

import { NavigationContainer } from '@react-navigation/native';

import NavigationStack from './src/navigator/NavigationStack';
import { Provider } from 'react-redux';
import store from './src/store/reducers/store';

const App: () => Node = () => {
  setupAxios()
  return (
    <Provider store={store}>
      <NavigationContainer>
        <NavigationStack />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
