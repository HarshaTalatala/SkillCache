import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Plus, Trash2, Edit, MoreVertical, AlertCircle } from 'lucide-react';
import { useVault } from '../context/VaultContext';

const Vaults = () => {
  const { vaults, loading, error, fetchVaults, createVault, deleteVault } = useVault();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newVaultData, setNewVaultData] = useState({
    name: '',
    description: '',
    isPrivate: true
  });
  
  useEffect(() => {
    fetchVaults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewVaultData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleCreateVault = async (e) => {
    e.preventDefault();
    try {
      await createVault(newVaultData);
      setNewVaultData({
        name: '',
        description: '',
        isPrivate: true
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating vault:", error);
    }
  };
  
  const handleDeleteVault = async (id) => {
    if (window.confirm("Are you sure you want to delete this vault? This action cannot be undone.")) {
      try {
        await deleteVault(id);
      } catch (error) {
        console.error("Error deleting vault:", error);
      }
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Knowledge Vaults</h1>
            <p className="text-muted-foreground">Organize and protect your specialized knowledge collections</p>
          </div>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="nothing-btn-primary flex items-center gap-2 max-w-max"
          >
            <Plus className="w-4 h-4" />
            New Vault
          </button>
        </div>
        
        {/* Error state */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">Error loading vaults</h3>
              <p className="text-destructive/80 text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Vaults Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaults.map((vault) => (
              <div
                key={vault.id}
                className="nothing-card p-6 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {vault.isPrivate ? (
                      <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center">
                        <Lock className="w-5 h-5 text-primary" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center">
                        <Unlock className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{vault.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(vault.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                
                <p className="mt-4 text-muted-foreground text-sm">
                  {vault.description || "No description provided."}
                </p>
                
                <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {vault.isPrivate ? "Private vault" : "Shared vault"}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteVault(vault.id)}
                      className="p-1.5 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                      title="Delete vault"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 rounded-full hover:bg-muted transition-colors"
                      title="Edit vault"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {vaults.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No vaults yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Create your first knowledge vault to organize specialized content
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="nothing-btn-primary flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Create First Vault
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Create Vault Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border/50 rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Create New Vault</h3>
              
              <form onSubmit={handleCreateVault} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                    Vault Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newVaultData.name}
                    onChange={handleInputChange}
                    className="nothing-input"
                    placeholder="Enter vault name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newVaultData.description}
                    onChange={handleInputChange}
                    className="nothing-input min-h-[100px]"
                    placeholder="Enter a brief description"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    name="isPrivate"
                    checked={newVaultData.isPrivate}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4"
                  />
                  <label htmlFor="isPrivate" className="text-sm font-medium text-foreground">
                    Private Vault
                  </label>
                </div>
                
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/30">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="nothing-btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="nothing-btn-primary"
                  >
                    Create Vault
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vaults;
