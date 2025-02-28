// src/components/ModernAdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { ConfigClient } from '../clients/configClient';
import ConfigModal from './ConfigModal';
import ThemeToggle from './ThemeToggle';

// Ícones SVG para o painel moderno
// src/components/ModernAdminPanel.tsx

// Corrigindo a definição de ícones para aceitar props style e className
const Icons = {
    MessageCircle: (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    Settings: (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    Check: (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    Pause: (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
      </svg>
    ),
    Play: (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    Trash: (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
    Search: (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    ArrowUp: (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    ),
    SendMessage: (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
    User: (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    Clock: (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    Bell: (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    ChatBubble: (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    BarChart: (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    Plus: (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    Edit: (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    )
  };

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

interface Message {
  id: number;
  thread_id: number;
  role: string;
  content: string;
  createdAt: string;
}

const ModernAdminPanel: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    paused: 0,
    responseRate: 98.2 // Exemplo para mostrar a tendência
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [configClient, setConfigClient] = useState<ConfigClient | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

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
          paused: data.data.pausedConversations || 0,
          responseRate: 98.2 // Valor de exemplo para ilustração
        });
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const fetchConversationDetails = async (identifier: string) => {
    try {
      setIsLoadingMessages(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/conversations/${identifier}`);
      if (!response.ok) throw new Error(`Falha ao buscar detalhes da conversa ${identifier}`);
      
      const data = await response.json();
      if (data.success && data.data) {
        setSelectedConversation(data.data.thread);
        setMessages(data.data.messages);
      }
    } catch (error) {
      console.error(`Erro ao buscar detalhes da conversa ${identifier}:`, error);
    } finally {
      setIsLoadingMessages(false);
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

      // Mostra notificação - (simulado, implementaria com uma biblioteca real)
      console.log(`Conversa ${currentPaused ? 'retomada' : 'pausada'} com sucesso!`);
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

      // Mostra notificação - (simulado, implementaria com uma biblioteca real)
      console.log('Conversa excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir conversa:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/conversations/${selectedConversation.identifier}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newMessage,
          role: 'assistant'
        })
      });

      if (!response.ok) throw new Error('Falha ao enviar mensagem');

      // Limpa o campo de mensagem
      setNewMessage('');
      
      // Atualiza as mensagens
      await fetchConversationDetails(selectedConversation.identifier);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
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

  const getInitials = (phone: string) => {
    const match = phone.match(/(\d+)@c\.us/);
    if (match && match[1]) {
      // Retorna os dois últimos dígitos para simplicidade
      return match[1].slice(-2);
    }
    return "WA";
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
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">
              <Icons.MessageCircle />
            </div>
            <h1>Painel Administrativo - WhatsApp Bot</h1>
          </div>
        </div>
        
        <div className="header-right">
          <ThemeToggle />
          
          <button className="icon-btn">
            <Icons.Bell />
          </button>
          
          <button 
            className="primary-btn"
            onClick={() => setIsConfigModalOpen(true)}
          >
            <Icons.Settings />
            <span>Configurações</span>
          </button>
        </div>
      </header>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon-wrapper total">
            <Icons.ChatBubble />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total de Conversas</p>
            <h2 className="stat-value">{stats.total}</h2>
            <div className="stat-trend up">
              <Icons.ArrowUp /> 12% esta semana
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper active">
            <Icons.Check />
          </div>
          <div className="stat-content">
            <p className="stat-title">Conversas Ativas</p>
            <h2 className="stat-value">{stats.active}</h2>
            <div className="stat-trend up">
              <Icons.ArrowUp /> 8% esta semana
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper paused">
            <Icons.Pause />
          </div>
          <div className="stat-content">
            <p className="stat-title">Conversas Pausadas</p>
            <h2 className="stat-value">{stats.paused}</h2>
            <div className="stat-trend down">
              <Icons.ArrowUp style={{ transform: 'rotate(180deg)' }} /> 3% esta semana
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper rate">
            <Icons.BarChart />
          </div>
          <div className="stat-content">
            <p className="stat-title">Taxa de Resposta</p>
            <h2 className="stat-value">{stats.responseRate}%</h2>
            <div className="stat-trend up">
              <Icons.ArrowUp /> 2.5% esta semana
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="conversations-list">
          <div className="list-header">
            <h2 className="list-title">Conversas</h2>
            <button className="icon-btn">
              <Icons.Plus />
            </button>
          </div>
          
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Buscar conversas..." 
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
            <Icons.Search className="search-icon" />
          </div>

          <div className="conversations">
            {filteredConversations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Icons.ChatBubble />
                </div>
                <h3 className="empty-title">Nenhuma conversa encontrada</h3>
                <p className="empty-description">Tente ajustar seu termo de busca ou aguarde novas conversas</p>
              </div>
            ) : (
              filteredConversations.map(conversation => (
                <div 
                  key={conversation.id} 
                  className={`conversation-item ${selectedConversation?.id === conversation.id ? 'selected' : ''}`}
                  onClick={() => fetchConversationDetails(conversation.identifier)}
                >
                  <div className="user-avatar">
                    <span className="avatar-text">{getInitials(conversation.identifier)}</span>
                    <span className={`status-indicator ${conversation.paused ? 'paused' : 'active'}`}></span>
                  </div>
                  
                  <div className="conversation-details">
                    <div className="conversation-header">
                      <h3 className="conversation-name">{formatPhoneNumber(conversation.identifier)}</h3>
                      <span className="conversation-time">
                        <Icons.Clock /> {formatDate(conversation.updatedAt)}
                      </span>
                    </div>
                    <div className="conversation-preview">{formatPreview(conversation.lastMessage || '')}</div>
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
                        <Icons.Play />
                      </button>
                    ) : (
                      <button 
                        className="action-button pause"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePauseConversation(conversation.identifier, false);
                        }}
                      >
                        <Icons.Pause />
                      </button>
                    )}
                    <button 
                      className="action-button delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conversation.identifier);
                      }}
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="conversation-details-panel">
          {selectedConversation ? (
            <>
              <div className="details-header">
                <h2 className="details-title">
                  <div className="user-avatar" style={{ width: '2rem', height: '2rem' }}>
                    <span className="avatar-text" style={{ fontSize: '0.875rem' }}>
                      {getInitials(selectedConversation.identifier)}
                    </span>
                  </div>
                  {formatPhoneNumber(selectedConversation.identifier)}
                  <span className={`badge ${selectedConversation.paused ? 'badge-warning' : 'badge-success'}`}>
                    {selectedConversation.paused ? 'Pausada' : 'Ativa'}
                  </span>
                </h2>
                <div className="details-actions">
                  {selectedConversation.paused ? (
                    <button 
                      className="action-btn secondary-btn"
                      onClick={() => togglePauseConversation(selectedConversation.identifier, true)}
                    >
                      <Icons.Play />
                      <span>Retomar</span>
                    </button>
                  ) : (
                    <button 
                      className="action-btn secondary-btn"
                      onClick={() => togglePauseConversation(selectedConversation.identifier, false)}
                    >
                      <Icons.Pause />
                      <span>Pausar</span>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="conversation-messages">
                {isLoadingMessages ? (
                  <div className="loading">
                    <div className="spinner"></div>
                    <span>Carregando mensagens...</span>
                  </div>
                ) : (
                  <div className="messages-container">
                    {messages.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">
                          <Icons.ChatBubble />
                        </div>
                        <h3 className="empty-title">Nenhuma mensagem</h3>
                        <p className="empty-description">Esta conversa ainda não possui mensagens</p>
                      </div>
                    ) : (
                      messages.map(message => (
                        <div key={message.id} className={`message ${message.role}`}>
                          <div className="message-content">
                            {message.content}
                          </div>
                          <div className="message-time">
                            {formatDate(message.createdAt)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                
                <form className="reply-box" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    className="reply-input"
                    placeholder="Digite uma mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="reply-button">
                    <Icons.SendMessage />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="placeholder-icon">
                <Icons.ChatBubble />
              </div>
              <p>Selecione uma conversa para visualizar os detalhes</p>
              <p className="hint">Você poderá ver o histórico de mensagens e interagir com a conversa</p>
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

export default ModernAdminPanel;