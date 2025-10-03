//@ts-nocheck
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import axios from 'axios';
import {observer} from 'mobx-react-lite';
import React, {useCallback, useMemo} from 'react';
import {Linking, LogBox, TextInput, Text} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {makeDecryption, makeEncryption} from './src/common/constant/encryption';
import delay from './src/common/services/delay';
import useIsDarkTheme from './src/hooks/useIsDarkTheme';
import RootStack from './src/navigations/RootStack';
import {RootStoreProvider, useRootStore} from './src/stores/rootStore';
import DarkTheme from './src/themes/darkTheme';
import DefaultTheme from './src/themes/defaultTheme';
import {withoutEncryptionApi} from './src/common/api/withoutEncrytApi';
import {ToastProvider} from './src/common/components/CustomToast';
import BootSplash from 'react-native-bootsplash';
import {procgURLL, secretKeyy, secureStorageKeyy} from '@env';

LogBox.ignoreLogs(['EventEmitter.removeListener', 'ViewPropTypes']);
if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}
if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}
export const ProcgURL = procgURLL;
export const secretKey = secretKeyy;
export const secureStorageKey = secureStorageKeyy;

const linking: LinkingOptions<any> = {
  prefixes: [
    /* your linking prefixes */
    'PROCG://',
    'https://procg.viscorp.app',
  ],
  config: {
    /* configuration for matching screens with paths */
    initialRouteName: 'Loader',
    screens: {
      Loader: {
        path: 'loader/:delay?/:text?',
        parse: {
          delay: ms => Number(ms),
          text: text => decodeURIComponent(text),
        },
        stringify: {
          delay: ms => String(ms),
          text: text => encodeURIComponent(text),
        },
      },
    },
  },
};

// Encryption process
axios.interceptors.request.use(
  async config => {
    let url = config?.url;
    if (withoutEncryptionApi.some(element => url?.includes(element))) {
      return config;
    }
    let copyOfConfig = {...config};
    const apiPrefixes = url?.includes('?');
    if (apiPrefixes) {
      let splitUrl = url?.split('?');
      const encryptedData = await makeEncryption(splitUrl?.[1]);
      url = `${splitUrl?.[0]}?${encryptedData}`;
      copyOfConfig = {...config, url};
    }
    let payload = null;
    if (config?.data) {
      payload = await makeEncryption(JSON.stringify(config?.data));
    }

    copyOfConfig = {
      ...copyOfConfig,
      data: payload,
      headers: {
        ...copyOfConfig.headers,
        'Content-Type': 'application/json',
      },
    };

    return copyOfConfig;
  },
  async error => {
    // console.log('error', JSON.stringify(error, null, 2));
    let decryptedData = await makeDecryption(error?.response?.data);
    let newError = {response: {data: decryptedData || ''}};
    return Promise.reject(newError);
  },
);

axios.interceptors.response.use(
  async response => {
    if (
      withoutEncryptionApi.some(element =>
        response?.config?.url?.includes(element),
      )
    ) {
      return response;
    }
    let decryptedData = makeDecryption(response?.data);
    return {
      status: response?.status,
      data: decryptedData,
    };
  },

  async error => {
    if (error?.response?.status === 401) {
      return Promise.reject({response: {data: 401}});
    } else if (error?.response?.status === 406) {
      return Promise.reject({response: {data: 406}});
    } else {
      let decryptedError = makeDecryption(error?.response?.data);
      let modifiedError = {response: {data: decryptedError || ''}};
      if (
        modifiedError?.response?.data?.message ===
        'No authenticationScheme was specified, and there was no DefaultChallengeScheme found. The default schemes can be set using either AddAuthentication(string defaultScheme) or AddAuthentication(Action<AuthenticationOptions> configureOptions).'
      ) {
      } else {
        return Promise.reject(modifiedError);
      }
    }
  },
);

const Main = observer(() => {
  const {hydrate} = useRootStore();

  const [isDark] = useIsDarkTheme();

  const theme = useMemo(() => {
    if (isDark) {
      return DarkTheme;
    }
    return DefaultTheme;
  }, [isDark]);

  const onReady = useCallback(async () => {
    try {
      const uri = await Linking.getInitialURL();
      if (uri) {
        await delay(200);
        await hydrate();
        await BootSplash.hide({fade: true});
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  }, [hydrate]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PaperProvider theme={theme}>
        <ToastProvider>
          <NavigationContainer
            linking={linking}
            theme={theme}
            onReady={onReady}>
            <RootStack />
          </NavigationContainer>
        </ToastProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
});

const App = () => {
  return (
    <RootStoreProvider>
      <Main />
    </RootStoreProvider>
  );
};

export default App;
