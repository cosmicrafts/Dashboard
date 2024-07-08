// src/services/CommonTokenService.ts
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { ICRC1TokenService, ICRC7NFTService } from './TokenService';

export const fetchICRC1Tokens = async (canisterId: string, account: Principal): Promise<bigint> => {
  const agent = new HttpAgent();
  const tokenService = new ICRC1TokenService(agent, canisterId);
  return await tokenService.fetchBalance(account);
};

export const fetchICRC7Tokens = async (canisterId: string, account: Principal): Promise<bigint[]> => {
  const agent = new HttpAgent();
  const nftService = new ICRC7NFTService(agent, canisterId);
  return await nftService.fetchTokens(account);
};
