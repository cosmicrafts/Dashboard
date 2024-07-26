import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface RefAccount {
  'multiplier' : number,
  'tiers' : Array<Tier>,
  'playerID' : Principal,
  'uuid' : UUID,
  'refByUUID' : UUID,
  'tokens' : Array<Token>,
  'netWorth' : number,
}
export interface Tier {
  'id' : TierID,
  'status' : string,
  'title' : string,
  'token' : Token,
  'desc' : string,
}
export type TierID = bigint;
export interface Token { 'title' : string, 'amount' : bigint }
export type UUID = string;
export interface _SERVICE {
  'calculateDynamicMultiplier' : ActorMethod<[bigint], number>,
  'calculateNetWorth' : ActorMethod<[Array<Token>], number>,
  'claimTierToken' : ActorMethod<[Principal], [boolean, string]>,
  'enrollByPrincipal' : ActorMethod<
    [[] | [string], Principal],
    [boolean, string]
  >,
  'enrollPlayer' : ActorMethod<[[] | [string]], [boolean, string]>,
  'generateRandomPrincipal' : ActorMethod<[], Principal>,
  'getAccount' : ActorMethod<[], [] | [RefAccount]>,
  'getAllAccounts' : ActorMethod<[], Array<RefAccount>>,
  'getAlltiers' : ActorMethod<[], Array<Tier>>,
  'getCurrentPlayerTier' : ActorMethod<[Principal], [] | [Tier]>,
  'getTopPlayers' : ActorMethod<[bigint], Array<[Principal, RefAccount]>>,
  'signupLinkShare' : ActorMethod<[], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
