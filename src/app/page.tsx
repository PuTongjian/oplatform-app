'use client';

import { useEffect, useState } from 'react';
import { TicketData, MessageData } from '@/types/dataTypes';
import Layout from '@/components/Layout';
import TabNavigation from '@/components/TabNavigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import TicketPanel from '@/components/TicketPanel';
import MessagePanel from '@/components/MessagePanel';
import TemplatePanel from '@/components/templates/TemplatePanel';
import AuthorizationPanel from '@/components/AuthorizationPanel';
import AuthorizedMerchantsPanel from '@/components/AuthorizedMerchantsPanel';

export default function Home() {
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'ticket' | 'messages' | 'templates' | 'authorization' | 'merchants'>('ticket');

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 获取Ticket数据
        const ticketRes = await fetch('/api/data/ticket');
        if (ticketRes.ok) {
          const ticket = await ticketRes.json();
          setTicketData(ticket);
        }

        // 获取消息数据
        const messagesRes = await fetch('/api/data/messages');
        if (messagesRes.ok) {
          const msgs = await messagesRes.json();
          setMessages(msgs);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 设置定时刷新，每30秒刷新一次
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  // 保存手动输入的Ticket（通过后端API）
  const saveTicket = async (data: any) => {
    // 调用服务端API保存ticket
    const response = await fetch('/api/ticket/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '保存失败');
    }

    // 更新页面显示的数据
    if (result.ticket) {
      setTicketData(result.ticket);
    }
  };

  return (
    <Layout>
      {/* 选项卡导航 */}
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        messagesCount={messages.length}
      />

      {loading ? (
        <LoadingSpinner message="正在获取数据..." />
      ) : (
        <>
          {/* 调用凭证内容 */}
          {activeTab === 'ticket' && (
            <TicketPanel
              ticketData={ticketData}
              onSaveTicket={saveTicket}
            />
          )}

          {/* 消息内容 */}
          {activeTab === 'messages' && (
            <MessagePanel messages={messages} />
          )}

          {/* 小程序模板库 */}
          {activeTab === 'templates' && (
            <TemplatePanel activeTab={activeTab} />
          )}

          {/* 小程序授权 */}
          {activeTab === 'authorization' && (
            <AuthorizationPanel activeTab={activeTab} />
          )}

          {/* 授权商家 */}
          {activeTab === 'merchants' && (
            <AuthorizedMerchantsPanel />
          )}
        </>
      )}
    </Layout>
  );
}
