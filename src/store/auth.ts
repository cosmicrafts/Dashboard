// src/store/auth.ts
import { defineStore } from 'pinia';
import { Actor, HttpAgent, type ActorSubclass } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import nacl from 'tweetnacl';
import { encode as base64Encode, decode as base64Decode } from 'base64-arraybuffer';
import MetaMaskService from '@/services/MetaMaskService';
import PhantomService from '@/services/PhantomService';
import { AuthClient } from '@dfinity/auth-client';
import { idlFactory as tournamentsIdlFactory } from '@/declarations/tournaments';
import { idlFactory as cosmicraftsIdlFactory } from '@/declarations/cosmicrafts';
import { idlFactory as nftIdlFactory } from '@/declarations/icrc7';
import { idlFactory as playerIdlFactory } from '@/declarations/player';
import { idlFactory as statisticsIdlFactory } from '@/declarations/statistics';
import { idlFactory as tokenIdlFactory } from '@/declarations/icrc1';
import type { _SERVICE as TournamentsService } from '@/declarations/tournaments/tournaments.did';
import type { _SERVICE as CosmicraftsService } from '@/declarations/cosmicrafts/cosmicrafts.did';
import type { _SERVICE as NFTService } from '@/declarations/icrc7/icrc7.did';
import type { _SERVICE as PlayerService } from '@/declarations/player/player.did';
import type { _SERVICE as StatisticsService } from '@/declarations/statistics/statistics.did';
import type { _SERVICE as TokenService } from '@/declarations/icrc1/icrc1.did';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { publicKey: string; privateKey: string } | null,
    isAuthenticated: false,
    googleSub: '' as string,
    principalId: '' as string,
    tournaments: null as ActorSubclass<TournamentsService> | null,
    cosmicrafts: null as ActorSubclass<CosmicraftsService> | null,
    nft: null as ActorSubclass<NFTService> | null,
    player: null as ActorSubclass<PlayerService> | null,
    statistics: null as ActorSubclass<StatisticsService> | null,
    token: null as ActorSubclass<TokenService> | null,
    authClient: null as AuthClient | null,
  }),
  actions: {
    async initializeStore() {
      const storedData = localStorage.getItem('authStore');
      if (storedData) {
        const data = JSON.parse(storedData);
        this.user = data.user;
        this.isAuthenticated = data.isAuthenticated;
        this.googleSub = data.googleSub;
        this.principalId = data.principalId;

        if (data.authClient) {
          this.authClient = await AuthClient.create();
        }

        if (this.isAuthenticated && this.user) {
          const identity = Ed25519KeyIdentity.fromKeyPair(
            base64ToUint8Array(this.user.publicKey),
            base64ToUint8Array(this.user.privateKey)
          );
          const agent = new HttpAgent({ identity, host: 'https://ic0.app' });

          if (import.meta.env.MODE !== 'production') {
            agent.fetchRootKey(); // Only for local development
          }

          const canisterIds = {
            tournaments: import.meta.env.VITE_CANISTER_ID_TOURNAMENTS,
            cosmicrafts: import.meta.env.VITE_CANISTER_ID_COSMICRAFTS,
            nft: import.meta.env.VITE_CANISTER_ID_ICRC7,
            player: import.meta.env.VITE_CANISTER_ID_PLAYER,
            statistics: import.meta.env.VITE_CANISTER_ID_STATISTICS,
            token: import.meta.env.VITE_CANISTER_ID_ICRC1,
          };

          await this.initializeActors(agent, canisterIds);
        }
      }
    },
    async loginWithGoogle(response: any, router: any) {
      const decodedIdToken = response.credential.split('.')[1];
      const payload = JSON.parse(atob(decodedIdToken));
      this.googleSub = payload.sub;
      await this.generateKeysFromSub(this.googleSub, router);
    },
    async loginWithMetaMask(router: any) {
      const uniqueMessage = 'Sign this message to log in with your Ethereum wallet';
      const signature = await MetaMaskService.signMessage(uniqueMessage);
      if (signature) {
        await this.generateKeysFromSignature(signature, router);
      }
    },
    async loginWithPhantom(router: any) {
      const message = 'Sign this message to log in with your Phantom Wallet';
      const signature = await PhantomService.signAndSend(message);
      if (signature) {
        await this.generateKeysFromSignature(signature, router);
      }
    },
    async loginWithInternetIdentity(router: any) {
      await this.loginWithAuthClient('https://identity.ic0.app', router);
    },
    async loginWithNFID(router: any) {
      await this.loginWithAuthClient('https://nfid.one/authenticate/?applicationName=COSMICRAFTS&applicationLogo=https://cosmicrafts.com/wp-content/uploads/2023/09/cosmisrafts-242x300.png#authorize', router);
    },
    async loginWithAuthClient(identityProviderUrl: string, router: any) {
      const authClient = await AuthClient.create();
      this.authClient = authClient;
      await authClient.login({
        identityProvider: identityProviderUrl,
        windowOpenerFeatures: `left=${window.screen.width / 2 - 525 / 2}, top=${window.screen.height / 2 - 705 / 2}, toolbar=0, location=0, menubar=0, width=525, height=705`,
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          await this.createIdentityFromAuthClient(identity, router);
          this.isAuthenticated = true;
          this.saveStateToLocalStorage();
          router.push({ name: 'Dashboard' });
        },
        onError: (error) => {
          console.error('Authentication error:', error);
        },
      });
    },
    async createIdentityFromAuthClient(identity: any, router: any) {
      const agent = new HttpAgent({ identity, host: 'https://ic0.app' });

      if (import.meta.env.MODE !== 'production') {
        agent.fetchRootKey(); // Only for local development
      }

      this.principalId = identity.getPrincipal().toText();
      this.user = { publicKey: '', privateKey: '' };

      const canisterIds = {
        tournaments: import.meta.env.VITE_CANISTER_ID_TOURNAMENTS,
        cosmicrafts: import.meta.env.VITE_CANISTER_ID_COSMICRAFTS,
        nft: import.meta.env.VITE_CANISTER_ID_ICRC7,
        player: import.meta.env.VITE_CANISTER_ID_PLAYER,
        statistics: import.meta.env.VITE_CANISTER_ID_STATISTICS,
        token: import.meta.env.VITE_CANISTER_ID_ICRC1,
      };

      await this.initializeActors(agent, canisterIds);
      this.saveStateToLocalStorage();
      router.push({ name: 'Dashboard' });
    },
    async generateKeysFromSignature(signature: string, router: any) {
      const encoder = new TextEncoder();
      const encodedSignature = encoder.encode(signature);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodedSignature);
      const seed = new Uint8Array(hashBuffer.slice(0, 32));
      const keyPair = nacl.sign.keyPair.fromSeed(seed);
      const publicKeyBase64 = base64Encode(keyPair.publicKey);
      const privateKeyBase64 = base64Encode(keyPair.secretKey);
      await this.createIdentity(publicKeyBase64, privateKeyBase64, router);
      this.isAuthenticated = true;
      this.saveStateToLocalStorage();
      router.push({ name: 'Dashboard' });
    },
    async generateKeysFromSub(sub: string, router: any) {
      const encoder = new TextEncoder();
      const encodedSub = encoder.encode(sub);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodedSub);
      const seed = new Uint8Array(hashBuffer.slice(0, 32));
      const keyPair = nacl.sign.keyPair.fromSeed(seed);
      const publicKeyBase64 = base64Encode(keyPair.publicKey);
      const privateKeyBase64 = base64Encode(keyPair.secretKey);
      await this.createIdentity(publicKeyBase64, privateKeyBase64, router);
      this.isAuthenticated = true;
      this.saveStateToLocalStorage();
      router.push({ name: 'Dashboard' });
    },
    async createIdentity(publicKey: string, privateKey: string, router: any) {
      const identity = Ed25519KeyIdentity.fromKeyPair(
        base64ToUint8Array(publicKey),
        base64ToUint8Array(privateKey)
      );
      const agent = new HttpAgent({ identity, host: 'https://ic0.app' });

      if (import.meta.env.MODE !== 'production') {
        agent.fetchRootKey(); // Only for local development
      }

      this.principalId = identity.getPrincipal().toText();
      this.user = { publicKey, privateKey };

      const canisterIds = {
        tournaments: import.meta.env.VITE_CANISTER_ID_TOURNAMENTS,
        cosmicrafts: import.meta.env.VITE_CANISTER_ID_COSMICRAFTS,
        nft: import.meta.env.VITE_CANISTER_ID_ICRC7,
        player: import.meta.env.VITE_CANISTER_ID_PLAYER,
        statistics: import.meta.env.VITE_CANISTER_ID_STATISTICS,
        token: import.meta.env.VITE_CANISTER_ID_ICRC1,
      };

      await this.initializeActors(agent, canisterIds);
      this.saveStateToLocalStorage();
      router.push({ name: 'Dashboard' });
    },
    async initializeActors(agent: HttpAgent, canisterIds: Record<string, string>) {
      const idlFactories: Record<string, any> = {
        tournaments: tournamentsIdlFactory,
        cosmicrafts: cosmicraftsIdlFactory,
        nft: nftIdlFactory,
        player: playerIdlFactory,
        statistics: statisticsIdlFactory,
        token: tokenIdlFactory,
      };

      for (const [key, idlFactory] of Object.entries(idlFactories)) {
        (this as any)[key] = Actor.createActor(idlFactory, { agent, canisterId: canisterIds[key] }) as ActorSubclass<any>;
      }
    },
    async initializeAdditionalActor(canisterId: string, idlFactory: any): Promise<ActorSubclass<any>> {
      if (!this.user) {
        throw new Error("User is not authenticated");
      }

      const identity = Ed25519KeyIdentity.fromKeyPair(
        base64ToUint8Array(this.user.publicKey),
        base64ToUint8Array(this.user.privateKey)
      );

      const agent = new HttpAgent({ identity, host: 'https://ic0.app' });

      if (import.meta.env.MODE !== 'production') {
        await agent.fetchRootKey(); // Only for local development
      }

      return Actor.createActor(idlFactory, { agent, canisterId });
    },
    saveStateToLocalStorage() {
      const authData = {
        user: this.user,
        isAuthenticated: this.isAuthenticated,
        googleSub: this.googleSub,
        principalId: this.principalId,
        authClient: this.authClient ? true : false, // Boolean to indicate authClient presence
      };
      localStorage.setItem('authStore', JSON.stringify(authData));
    },
    async logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.googleSub = '';
      this.principalId = '';
      this.tournaments = null;
      this.cosmicrafts = null;
      this.nft = null;
      this.player = null;
      this.statistics = null;
      this.token = null;
      this.authClient = null;
      localStorage.removeItem('authStore');
    }
  },
});

function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; len > i; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
