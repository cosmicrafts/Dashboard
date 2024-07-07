import { Actor, HttpAgent, type ActorSubclass } from '@dfinity/agent';
import { idlFactory as playerIdlFactory } from '@/declarations/player';
import type { Principal } from '@dfinity/principal';

export const fetchUserDetails = async (canisterId: string, account: Principal) => {
  const agent = new HttpAgent();
  const actor = Actor.createActor(playerIdlFactory, { agent, canisterId });

  return await actor.getUserDetails(account);
};

// Add other service functions as needed
