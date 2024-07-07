// src/services/CommonTokenService.ts
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as icrc1IdlFactory } from '@/declarations/icrc1';
import { idlFactory as icrc7IdlFactory } from '@/declarations/icrc7';
import type { Principal } from '@dfinity/principal';

type ICRC1Service = {
  icrc1_balance_of: (account: { owner: Principal; subaccount: [] | [Uint8Array | number[]] }) => Promise<bigint>;
};

type ICRC7Service = {
  icrc7_tokens_of: (account: { owner: Principal; subaccount: [] | [Uint8Array | number[]] }) => Promise<{ Ok: bigint[] } | { Err: any }>;
};

export const fetchICRC1Tokens = async (canisterId: string, account: Principal): Promise<bigint> => {
  const agent = new HttpAgent();
  const actor = Actor.createActor<ICRC1Service>(icrc1IdlFactory, { agent, canisterId });
  return await actor.icrc1_balance_of({ owner: account, subaccount: [] });
};

export const fetchICRC7Tokens = async (canisterId: string, account: Principal): Promise<bigint[]> => {
  const agent = new HttpAgent();
  const actor = Actor.createActor<ICRC7Service>(icrc7IdlFactory, { agent, canisterId });
  const result = await actor.icrc7_tokens_of({ owner: account, subaccount: [] });
  if ('Ok' in result) {
    return result.Ok;
  } else {
    throw new Error('Error fetching ICRC7 tokens');
  }
};
