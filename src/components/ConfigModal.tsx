// src/components/ConfigModal.tsx
import React, { useState, useEffect } from 'react';
import { ConfigClient } from '../clients/configClient';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  configClient: ConfigClient;
}

interface ConfigItem {
  key: string;
  value: string;
  description?: string;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, configClient }) => {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingConfig, setEditingConfig] = useState<ConfigItem | null>(null);
  const [newConfigKey, setNewConfigKey] = useState<string>('');
  const [newConfigValue, setNewConfigValue] = useState<string>('');
  const [newConfigDescription, setNewConfigDescription] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadConfigs();
    }
  }, [isOpen]);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await configClient.getAllConfigs();
      setConfigs(data || {});
    } catch (err) {
      setError('Erro ao carregar configurações');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingConfig) return;
    
    try {
      setLoading(true);
      await configClient.updateConfig(
        editingConfig.key, 
        editingConfig.value, 
        editingConfig.description
      );
      setEditingConfig(null);
      await loadConfigs();
    } catch (err: any) {
      setError(`Erro ao salvar configuração: ${err.message || 'Erro desconhecido'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddConfig = async () => {
    if (!newConfigKey || !newConfigValue) return;
    
    try {
      setLoading(true);
      await configClient.setConfig(
        newConfigKey,
        newConfigValue,
        newConfigDescription || undefined
      );
      setNewConfigKey('');
      setNewConfigValue('');
      setNewConfigDescription('');
      setShowAddForm(false);
      await loadConfigs();
    } catch (err: any) {
      setError(`Erro ao adicionar configuração: ${err.message || 'Erro desconhecido'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="config-modal">
        <div className="modal-header">
          <h2>Configurações do Sistema</h2>
          <button className="close-button" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-content">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <>
              <div className="config-actions">
                <button 
                  className="add-config-button"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  {showAddForm ? 'Cancelar' : 'Adicionar Nova Configuração'}
                </button>
              </div>

              {showAddForm && (
                <div className="add-config-form">
                  <h3>Nova Configuração</h3>
                  <div className="form-group">
                    <label>Chave:</label>
                    <input 
                      type="text" 
                      value={newConfigKey}
                      onChange={(e) => setNewConfigKey(e.target.value)}
                      placeholder="CHAVE_CONFIG"
                    />
                  </div>
                  <div className="form-group">
                    <label>Valor:</label>
                    <input 
                      type="text" 
                      value={newConfigValue}
                      onChange={(e) => setNewConfigValue(e.target.value)}
                      placeholder="valor"
                    />
                  </div>
                  <div className="form-group">
                    <label>Descrição (opcional):</label>
                    <input 
                      type="text" 
                      value={newConfigDescription}
                      onChange={(e) => setNewConfigDescription(e.target.value)}
                      placeholder="Descrição da configuração"
                    />
                  </div>
                  <div className="form-actions">
                    <button 
                      className="cancel-button"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancelar
                    </button>
                    <button 
                      className="save-button"
                      onClick={handleAddConfig}
                      disabled={!newConfigKey || !newConfigValue}
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              )}

              <div className="configs-table">
                <table>
                  <thead>
                    <tr>
                      <th>Chave</th>
                      <th>Valor</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(configs).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>
                          {editingConfig && editingConfig.key === key ? (
                            <input 
                              type="text" 
                              value={editingConfig.value}
                              onChange={(e) => setEditingConfig({
                                ...editingConfig,
                                value: e.target.value
                              })}
                            />
                          ) : (
                            <span className="config-value">
                              {key.includes('KEY') || key.includes('URL') ? 
                                `${value.substring(0, 5)}...${value.substring(value.length - 5)}` : 
                                value
                              }
                            </span>
                          )}
                        </td>
                        <td>
                          {editingConfig && editingConfig.key === key ? (
                            <div className="edit-actions">
                              <button 
                                className="cancel-edit"
                                onClick={() => setEditingConfig(null)}
                              >
                                Cancelar
                              </button>
                              <button 
                                className="save-edit"
                                onClick={handleSaveEdit}
                              >
                                Salvar
                              </button>
                            </div>
                          ) : (
                            <button 
                              className="edit-button"
                              onClick={() => setEditingConfig({ key, value })}
                            >
                              Editar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;