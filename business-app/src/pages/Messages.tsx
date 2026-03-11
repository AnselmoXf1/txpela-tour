import React, { useEffect, useState } from 'react';
import { messageService, Message } from '../services/api';
import { MessageSquare, Send } from 'lucide-react';

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data } = await messageService.getAll();
      setMessages(data);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      await messageService.markAsRead(message._id);
      setMessages(messages.map(m => 
        m._id === message._id ? { ...m, read: true } : m
      ));
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !reply.trim()) return;

    try {
      await messageService.reply(selectedMessage._id, reply);
      setReply('');
      alert('Resposta enviada!');
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <MessageSquare size={32} />
          Mensagens
        </h1>
        <p className="text-gray-600 mt-2">Gerencie mensagens de clientes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de mensagens */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Todas as Mensagens</h2>
          </div>
          <div className="overflow-y-auto max-h-[600px]">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Carregando...</div>
            ) : messages.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Nenhuma mensagem</div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  onClick={() => handleSelectMessage(message)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                    selectedMessage?._id === message._id ? 'bg-blue-50' : ''
                  } ${!message.read ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-800">{message.user_name}</p>
                    {!message.read && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{message.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detalhes da mensagem */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          {selectedMessage ? (
            <div className="flex flex-col h-[600px]">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">{selectedMessage.user_name}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800">{selectedMessage.content}</p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Digite sua resposta..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                  />
                  <button
                    onClick={handleReply}
                    disabled={!reply.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <Send size={20} />
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[600px] text-gray-500">
              Selecione uma mensagem para visualizar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
