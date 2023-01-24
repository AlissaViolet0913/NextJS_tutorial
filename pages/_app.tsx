import '../styles/globals.css'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // reactqueryではデフォでrestAPIへのfetchに失敗した場合、自動的に3回までretryを繰り返す機能をfalseで無効化
      retry: false,
      // ユーザーがブラウザにフォーカスをあてたときにrestAPIへのfetchが走るのをfalseで無効化
      refetchOnWindowFocus: false,
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  // アプリが機能したときにaxiosのデフォの設定でwithCredentialsをtrueに設定
  // withCredentials：フロントとサーバーサイドでcookieのやりとりをする場合はtrueにする必要がある
  axios.defaults.withCredentials = true
  useEffect(() => {
    // アプリケーションガロードされたときにrestAPIのauth/csrfのエンドポイントにアクセスして
    // csrfTokenを取得
    // axios.get（）メソッドで取得したdataの中からcsrfTokenを取得して
    // axios.default設定でheaderにcsrf-tokenの名前をつけて設定する
    const getCsrfToken = async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/csrf`
      )
      axios.defaults.headers.common['csrf-token'] = data.csrfToken
    }
    getCsrfToken()
  }, [])
  return (
    // プロジェクト全体でreactQueryを使用できるようにMantineProviderの外側をラップする
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark',
          fontFamily: 'Verdana, sans-serif',
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
      {/*reactQueryのdevelopmentToolsを使えるようにする */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default MyApp
