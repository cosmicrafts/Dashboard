// src/services/PhantomService.ts
import { Connection, clusterApiUrl } from '@solana/web3.js';

declare global {
  interface Window {
    solana?: any;
  }
}

class PhantomService {
  connection: Connection;

  constructor() {
    this.connection = new Connection(clusterApiUrl('mainnet-beta')); // Adjust based on your needs
  }

  async connectWallet(): Promise<string | null> {
    if (window.solana && window.solana.isPhantom) {
      console.log('Phantom wallet found.');
      try {
        const response = await window.solana.connect();
        console.log('Connected with Public Key:', response.publicKey.toString());
        return response.publicKey.toString();
      } catch (err) {
        console.error('Could not connect to Phantom Wallet:', err);
        return null;
      }
    } else {
      alert('Phantom Wallet not found. Please install it.');
      return null;
    }
  }

  async signAndSend(message: string): Promise<string | null> {
    if (!window.solana.isConnected) {
      const walletConnection = await this.connectWallet();
      if (!walletConnection) return null;
    }

    try {
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await window.solana.signMessage(encodedMessage, 'utf8');
      console.log('Signed Message:', signedMessage.signature);
      return signedMessage.signature;
    } catch (err) {
      console.error('Error signing message with Phantom Wallet:', err);
      return null;
    }
  }
}

export default new PhantomService();
