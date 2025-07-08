import Layout from '@/components/Layout';
import AuthorizedMerchantsPanel from '@/components/AuthorizedMerchantsPanel';

export default function AuthorizedMerchantsPage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">授权商家管理</h1>
        <AuthorizedMerchantsPanel />
      </div>
    </Layout>
  );
} 