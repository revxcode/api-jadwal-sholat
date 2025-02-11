// pages/docs.tsx
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamically import SwaggerUI without SSR
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  return (
    <div>
      <Head>
        <title>API Documentation </title>
      </Head>
      < SwaggerUI
        url="/api/swagger"
      />
    </div>
  );
}