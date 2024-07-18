"use client"

import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import store from '@/state/store';
import { SessionProvider } from 'next-auth/react';
import { Next13ProgressBar } from 'next13-progressbar'; // https://github.com/ndungtse/next13-progressbar
import ModalsRouteChange from '@/components/ModalsRouteChange';
import RouteModal from '@/components/RouteModal';
import Toast from '@/components/Toast';
import '@/app/globals.css'
// react query
import { QueryClient, QueryClientProvider } from 'react-query';

// instancia de QueryClient
const queryClient = new QueryClient();

const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider attribute='class' defaultTheme='system'>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Next13ProgressBar height="4px" color="#1d9bf0" options={{ showSpinner: false }} showOnShallow />
            <ModalsRouteChange />
            <RouteModal />
            <Toast />
            {children}
          </QueryClientProvider>
        </Provider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default App;











//

//   useUser();

//   const user = useSelector((state: RootState) => state.user)

//   const { data: session, status, update } = useSession()
//   if (status == "loading") {
//     return "Loading..."
//   }

//



// import React from 'react';
// import { Provider } from 'react-redux';
// import { ThemeProvider } from 'next-themes';
// import { SessionProvider } from 'next-auth/react';
// import { AppProps } from 'next/app';  // Importar AppProps para tipos
// import store from '@/state/store';

// export default function App({
//   Component,
//   pageProps: { session, ...pageProps },  // Desestructuración para obtener `session` del `pageProps`
// }: AppProps) {
//   return (
//     <ThemeProvider attribute='class' defaultTheme='system'>
//       <SessionProvider session={session}>
//         <Provider store={store}>
//           <Component {...pageProps} />
//         </Provider>
//       </SessionProvider>
//     </ThemeProvider>
//   );
// }