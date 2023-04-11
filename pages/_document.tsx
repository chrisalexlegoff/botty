import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr" className="h-full">
      <Head />
      <body className="dark:bg-gray-900 dark:text-white bg-gray-50 text-black h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
