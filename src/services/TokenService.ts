// src/services/TokenService.ts

import { Actor, HttpAgent } from '@dfinity/agent';
import type { Principal } from '@dfinity/principal';
import { idlFactory as icrc1IdlFactory } from '@/declarations/icrc1';
import { idlFactory as icrc7IdlFactory } from '@/declarations/icrc7';

export interface ITokenService {
  fetchBalance(account: Principal): Promise<bigint>;
}

export interface INFTService {
  fetchTokens(account: Principal): Promise<bigint[]>;
}

export class ICRC1TokenService implements ITokenService {
  private actor: any;

  constructor(agent: HttpAgent, canisterId: string) {
    this.actor = Actor.createActor(icrc1IdlFactory, { agent, canisterId });
  }

  async fetchBalance(account: Principal): Promise<bigint> {
    return await this.actor.icrc1_balance_of({ owner: account, subaccount: [] });
  }
}

export class ICRC7NFTService implements INFTService {
  private actor: any;

  constructor(agent: HttpAgent, canisterId: string) {
    this.actor = Actor.createActor(icrc7IdlFactory, { agent, canisterId });
  }

  async fetchTokens(account: Principal): Promise<bigint[]> {
    const result = await this.actor.icrc7_tokens_of({ owner: account, subaccount: [] });
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error('Error fetching ICRC7 tokens');
    }
  }
}
