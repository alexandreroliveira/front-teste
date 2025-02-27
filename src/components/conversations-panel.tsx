import React, { useState, useEffect } from 'react';
import { 
  Pause, 
  Play, 
  RefreshCw, 
  Search, 
  Settings, 
  Trash2 
} from 'lucide-react';

// Interface for Conversation
interface Conversation {
  id: number;
  identifier: string;
  medium: string;
  paused: boolean;
  createdAt: string;
  updatedAt: string;
  openai_thread_id?: string;
}

const ConversationsPanel: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [totalConversations, setTotalConversations] = useState(0);
  const [activeChatCount, setActiveChatCount] = useState(0);
  const [pausedChatCount, setPausedChatCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://playground-ordem-production.up.railway.app/api/conversations?page=${page}&limit=20&search=${searchTerm}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      
      const data = await response.json();
      
      setConversations(data.data.conversations);
      setTotalConversations(data.data.total);
      
      // Count active and paused conversations
      const active = data.data.conversations.filter((conv: Conversation) => !conv.paused).length;
      const paused = data.data.conversations.filter((conv: Conversation) => conv.paused).length;
      
      setActiveChatCount(active);
      setPausedChatCount(paused);
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [page, searchTerm]);

  const handlePauseResume = async (conversation: Conversation) => {
    try {
      const endpoint = conversation.paused 
        ? `https://playground-ordem-production.up.railway.app/api/conversations/${conversation.identifier}/resume`
        : `https://playground-ordem-production.up.railway.app/api/conversations/${conversation.identifier}/pause`;
      
      const response = await fetch(endpoint, { method: 'POST' });
      
      if (!response.ok) {
        throw new Error('Failed to update conversation status');
      }
      
      // Refresh the list after pausing/resuming
      fetchConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleDelete = async (conversation: Conversation) => {
    try {
      const response = await fetch(`https://playground-ordem-production.up.railway.app/api/conversations/${conversation.identifier}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }
      
      // Refresh the list after deletion
      fetchConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold">Conversas</h1>
          <div className="flex items-center space-x-2">
            <button 
              onClick={fetchConversations} 
              className="text-gray-600 hover:bg-gray-100 p-2 rounded"
            >
              <RefreshCw size={20} />
            </button>
            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Conversation Counts */}
        <div className="flex p-4 space-x-4 border-b">
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold">{totalConversations}</div>
            <div className="text-gray-500">Total de Conversas</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-green-600">{activeChatCount}</div>
            <div className="text-gray-500">Conversas Ativas</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-yellow-600">{pausedChatCount}</div>
            <div className="text-gray-500">Conversas Pausadas</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar conversas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-8 border rounded-md bg-gray-50"
            />
            <Search 
              className="absolute left-2 top-3 text-gray-400" 
              size={20} 
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div className="text-center py-4 text-gray-500">Carregando...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-4 text-gray-500">Nenhuma conversa encontrada</div>
          ) : (
            conversations.map(conv => (
              <div 
                key={conv.id} 
                className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="flex-grow">
                  <div className="font-medium">{conv.identifier}</div>
                  <div className="text-gray-500 text-sm">{formatDate(conv.createdAt)}</div>
                </div>
                <div className="flex items-center space-x-2">
                  {conv.paused ? (
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  ) : (
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                  <div className="flex space-x-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePauseResume(conv);
                      }}
                      className={`hover:bg-opacity-20 p-1 rounded ${
                        conv.paused 
                        ? 'text-green-600 hover:bg-green-100' 
                        : 'text-yellow-600 hover:bg-yellow-100'
                      }`}
                    >
                      {conv.paused ? <Play size={20} /> : <Pause size={20} />}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(conv);
                      }}
                      className="text-red-600 hover:bg-red-100 p-1 rounded"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t">
          <button 
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="text-blue-600 disabled:text-gray-300 hover:bg-blue-50 p-2 rounded"
          >
            Anterior
          </button>
          <span className="text-gray-600">Página {page}</span>
          <button 
            onClick={() => setPage(page + 1)}
            className="text-blue-600 hover:bg-blue-50 p-2 rounded"
          >
            Próxima
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        {selectedConversation ? (
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Detalhes da Conversa</h2>
            <div className="space-y-2">
              <p><strong>Identificador:</strong> {selectedConversation.identifier}</p>
              <p><strong>Meio:</strong> {selectedConversation.medium}</p>
              <p><strong>Status:</strong> {selectedConversation.paused ? 'Pausada' : 'Ativa'}</p>
              <p><strong>Criada em:</strong> {formatDate(selectedConversation.createdAt)}</p>
              <p><strong>Última atualização:</strong> {formatDate(selectedConversation.updatedAt)}</p>
              {selectedConversation.openai_thread_id && (
                <p><strong>ID da Thread OpenAI:</strong> {selectedConversation.openai_thread_id}</p>
              )}
              <div className="flex space-x-2 pt-4">
                <button 
                  onClick={() => handlePauseResume(selectedConversation)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded ${
                    selectedConversation.paused 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  {selectedConversation.paused ? <Play size={20} /> : <Pause size={20} />}
                  <span>{selectedConversation.paused ? 'Retomar' : 'Pausar'}</span>
                </button>
                <button 
                  onClick={() => handleDelete(selectedConversation)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <Trash2 size={20} />
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <svg 
              className="mx-auto mb-4 text-gray-400" 
              width="60" 
              height="60" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            Selecione uma conversa para visualizar os detalhes
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsPanel;
