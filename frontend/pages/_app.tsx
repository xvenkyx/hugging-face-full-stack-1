import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store";
import { useEffect, useState } from "react";
import { loadToken } from "@/store/authSlice";
import Navbar from "@/components/Navbar";


function TokenLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);


  useEffect(() => {
    dispatch(loadToken());
    setReady(true);
  }, [dispatch]);


  // Delaying UI rendering until token is loaded
  if (!ready) return null;


  return <>{children}</>;
}


export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <TokenLoader>
        <Navbar />
        <Component {...pageProps} />
      </TokenLoader>
    </Provider>
  );
}
