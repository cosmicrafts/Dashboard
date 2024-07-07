import { Actor, HttpAgent, type ActorSubclass } from '@dfinity/agent';
import { idlFactory as statisticsIdlFactory } from '@/declarations/statistics';
import type { Principal } from '@dfinity/principal';

export const fetchPlayerStats = async (canisterId: string, account: Principal) => {
  const agent = new HttpAgent();
  const actor = Actor.createActor(statisticsIdlFactory, { agent, canisterId });

  return await actor.getPlayerStats(account);
};

// Add other service functions as needed
