import React, { useState } from 'react';
import { StoreContext } from 'redux-react-hook';
import { Vault, VaultOptions } from '@hyperion-framework/vault';
import { ResourceContextType, ResourceProvider } from './ResourceContext';

export const ReactVaultContext = React.createContext<{
  vault: Vault | null;
  setVaultInstance: (vault: Vault) => void;
}>({
  vault: null,
  setVaultInstance: (vault: Vault) => {
    // Do nothing.
  },
});

export const VaultProvider: React.FC<{
  vault?: Vault;
  vaultOptions?: VaultOptions;
  resources?: ResourceContextType;
}> = ({ vault, vaultOptions, resources, children }) => {
  const [vaultInstance, setVaultInstance] = useState<Vault>(() => {
    if (vault) {
      return vault;
    }
    if (vaultOptions) {
      return new Vault(vaultOptions);
    }
    return new Vault();
  });

  return (
    <ReactVaultContext.Provider value={{ vault: vaultInstance, setVaultInstance }}>
      <StoreContext.Provider value={vaultInstance.getStore()}>
        <ResourceProvider value={resources || {}}>{children}</ResourceProvider>
      </StoreContext.Provider>
    </ReactVaultContext.Provider>
  );
};
