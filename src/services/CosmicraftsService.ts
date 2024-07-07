import { Actor, HttpAgent, type ActorSubclass } from '@dfinity/agent';
import { idlFactory as cosmicraftsIdlFactory } from '@/declarations/cosmicrafts';
import type { Principal } from '@dfinity/principal';

export const fetchPlayerData = async (canisterId: string, account: Principal) => {
  const agent = new HttpAgent();
  const actor = Actor.createActor(cosmicraftsIdlFactory, { agent, canisterId });

  return await actor.getPlayerData(account);
};

// Add other service functions as needed
