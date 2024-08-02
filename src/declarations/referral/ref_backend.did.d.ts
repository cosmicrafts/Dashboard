import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface RMatch {
  'id' : string,
  'fee' : number,
  'status' : Status,
  'date' : Time,
  'name' : string,
  'winner' : [] | [Principal],
  'entry' : number,
  'player1' : Principal,
  'player2' : [] | [Principal],
  'price' : number,
}
export interface RPlayer {
  'id' : Principal,
  'balance' : number,
  'name' : string,
}
export interface RefAccView {
  'multiplier' : number,
  'signupTokenSum' : bigint,
  'playerID' : Principal,
  'tierTokenSum' : bigint,
  'currentTier' : Tier,
  'topTokenAmount' : [bigint, string],
  'playerName' : string,
  'singupLink' : string,
  'topPosition' : bigint,
  'netWorth' : bigint,
  'topPlayers' : Array<TopView>,
}
export interface RefAccount {
  'tiers' : Array<Tier>,
  'alias' : string,
  'playerID' : Principal,
  'uuid' : UUID,
  'refByUUID' : UUID,
  'tokens' : Array<Token>,
}
export type Status = { 'complete' : null } |
  { 'progress' : null } |
  { 'waiting' : null };
export interface Tier {
  'id' : TierID,
  'status' : string,
  'title' : string,
  'token' : Token,
  'desc' : string,
}
export type TierID = bigint;
export type Time = bigint;
export interface Token { 'title' : string, 'amount' : bigint }
export interface TopView {
  'multiplier' : number,
  'playerName' : string,
  'netWorth' : bigint,
}
export type UUID = string;
export interface _SERVICE {
  'ref_account' : ActorMethod<[], [] | [RefAccount]>,
  'ref_account_all' : ActorMethod<[], Array<[string, Principal]>>,
  'ref_account_by' : ActorMethod<[Principal], [] | [RefAccount]>,
  'ref_account_view' : ActorMethod<[Principal], [] | [RefAccView]>,
  'ref_claim_tier' : ActorMethod<[Principal], [boolean, string]>,
  'ref_claim_top' : ActorMethod<[Principal, bigint], [boolean, string]>,
  'ref_complete_match' : ActorMethod<[string, Principal], [] | [RMatch]>,
  'ref_create_match' : ActorMethod<[RPlayer, number], RMatch>,
  'ref_enroll' : ActorMethod<[[] | [string], string], [boolean, string]>,
  'ref_enroll_by' : ActorMethod<
    [[] | [string], Principal, string],
    [boolean, string]
  >,
  'ref_find_match' : ActorMethod<[string], [] | [RMatch]>,
  'ref_grant_prize' : ActorMethod<[RMatch], [] | [Principal]>,
  'ref_id_gen' : ActorMethod<[], Principal>,
  'ref_join_match' : ActorMethod<[RPlayer, string], [] | [RMatch]>,
  'ref_tier_all' : ActorMethod<[], Array<Tier>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
