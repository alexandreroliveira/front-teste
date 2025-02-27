// src/components/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { ConfigClient } from '../clients/configClient';
import ConfigModal from './ConfigModal';

interface Conversation {
  id: number;
  identifier: string;
  medium: string;
  openai_thread_id: string;
  paused: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
}

const AdminPanel: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    paused: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [configClient, setConfigClient] = useState<ConfigClient | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  useEffect(() => {
    // Inicializa o cliente de configuração
    const client = new ConfigClient(process.env.REACT_APP_API_URL || 'http://localhost:8080');
    setConfigClient(client);

    // Carrega as conversas e estatísticas
    fetchConversations();
    fetchStats();

    // Atualiza a cada 30 segundos
    const interval = setInterval(() => {
      fetchConversations();
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/conversations`);
      if (!response.ok) throw new Error('Falha ao buscar conversas');
      
      const data = await response.json();
      if (data.success && data.data.conversations) {
        setConversations(data.data.conversations);
      }
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/conversations/stats/metrics`);
      if (!response.ok) throw new Error('Falha ao buscar estatísticas');
      
      const data = await response.json();
      if (data.success) {
        setStats({
          total: data.data.totalConversations || 0,
          active: data.data.activeConversations || 0,
          paused: data.data.pausedConversations || 0
        });
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const fetchConversationDetails = async (identifier: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/conversations/${identifier}`);
      if (!response.ok) throw new Error(`Falha ao buscar detalhes da conversa ${identifier}`);
      
      const data = await response.json();
      if (data.success && data.data) {
        setSelectedConversation(data.data.thread);
        setMessages(data.data.messages);
      }
    } catch (error) {
      console.error(`Erro ao buscar detalhes da conversa ${identifier}:`, error);
    }
  };

  const togglePauseConversation = async (identifier: string, currentPaused: boolean) => {
    try {
      const endpoint = currentPaused ? 'resume' : 'pause';
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/conversations/${identifier}/${endpoint}`, {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error(`Falha ao ${currentPaused ? 'retomar' : 'pausar'} conversa`);
      
      // Atualiza a lista de conversas e as estatísticas
      await fetchConversations();
      await fetchStats();
      
      // Se a conversa selecionada foi alterada, atualiza também os detalhes
      if (selectedConversation && selectedConversation.identifier === identifier) {
        await fetchConversationDetails(identifier);
      }
    } catch (error) {
      console.error(`Erro ao ${currentPaused ? 'retomar' : 'pausar'} conversa:`, error);
    }
  };

  const deleteConversation = async (identifier: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a conversa ${identifier}?`)) {
      return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/conversations/${identifier}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Falha ao excluir conversa');
      
      // Atualiza a lista de conversas e as estatísticas
      await fetchConversations();
      await fetchStats();
      
      // Se a conversa excluída era a selecionada, limpa a seleção
      if (selectedConversation && selectedConversation.identifier === identifier) {
        setSelectedConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Erro ao excluir conversa:', error);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Extrai o número do identificador (formato: 123@c.us)
    const match = phone.match(/(\d+)@c\.us/);
    if (match && match[1]) {
      return match[1].replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
    }
    return phone;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatPreview = (message: string) => {
    if (!message) return '';
    if (message.length > 40) {
      return message.substring(0, 40) + '...';
    }
    return message;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredConversations = conversations.filter(conv => 
    conv.identifier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-panel">
      <header className="header">
        <h1>Painel Administrativo - WhatsApp Bot</h1>
        <button 
          className="config-button"
          onClick={() => setIsConfigModalOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          Configurações
        </button>
      </header>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-title">Total de Conversas</p>
            <h2 className="stat-value">{stats.total}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-title">Conversas Ativas</p>
            <h2 className="stat-value">{stats.active}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-title">Conversas Pausadas</p>
            <h2 className="stat-value">{stats.paused}</h2>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="conversations-list">
          <h2>Conversas</h2>
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Buscar conversas..." 
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          <div className="conversations">
            {filteredConversations.length === 0 ? (
              <div className="no-conversations">
                <p>Nenhuma conversa encontrada</p>
              </div>
            ) : (
              filteredConversations.map(conversation => (
                <div 
                  key={conversation.id} 
                  className={`conversation-item ${selectedConversation?.id === conversation.id ? 'selected' : ''}`}
                  onClick={() => fetchConversationDetails(conversation.identifier)}
                >
                  <div className="user-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {conversation.paused ? null : (
                      <span className="status-indicator active"></span>
                    )}
                  </div>
                  <div className="conversation-details">
                    <div className="conversation-header">
                      <h3>{formatPhoneNumber(conversation.identifier)}</h3>
                      <span className="conversation-time">{formatDate(conversation.updatedAt)}</span>
                    </div>
                    <p className="conversation-preview">{formatPreview(conversation.lastMessage || '')}</p>
                  </div>
                  <div className="conversation-actions">
                    {conversation.paused ? (
                      <button 
                        className="action-button resume"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePauseConversation(conversation.identifier, true);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </button>
                    ) : (
                      <button 
                        className="action-button pause"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePauseConversation(conversation.identifier, false);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="6" y="4" width="4" height="16"></rect>
                          <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                      </button>
                    )}
                    <button 
                      className="action-button delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conversation.identifier);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="conversation-details-panel">
          {selectedConversation ? (
            <div className="conversation-messages">
              <h2>Detalhes da Conversa</h2>
              <div className="messages-container">
                {messages.map(message => (
                  <div key={message.id} className={`message ${message.role}`}>
                    <div className="message-content">
                      {message.content}
                    </div>
                    <div className="message-time">
                      {formatDate(message.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-conversation-selected">
              <div className="placeholder-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <p>Selecione uma conversa para visualizar os detalhes</p>
            </div>
          )}
        </div>
      </div>

      {configClient && (
        <ConfigModal 
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          configClient={configClient}
        />
      )}
    </div>
  );
};

export default AdminPanel;