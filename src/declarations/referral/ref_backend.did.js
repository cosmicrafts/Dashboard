export const idlFactory = ({ IDL }) => {
  const TierID = IDL.Nat;
  const Token = IDL.Record({ 'title' : IDL.Text, 'amount' : IDL.Nat });
  const Tier = IDL.Record({
    'id' : TierID,
    'status' : IDL.Text,
    'title' : IDL.Text,
    'token' : Token,
    'desc' : IDL.Text,
  });
  const UUID = IDL.Text;
  const RefAccount = IDL.Record({
    'tiers' : IDL.Vec(Tier),
    'alias' : IDL.Text,
    'playerID' : IDL.Principal,
    'uuid' : UUID,
    'refByUUID' : UUID,
    'tokens' : IDL.Vec(Token),
  });
  const TopView = IDL.Record({
    'multiplier' : IDL.Float64,
    'playerName' : IDL.Text,
    'netWorth' : IDL.Nat,
  });
  const RefAccView = IDL.Record({
    'multiplier' : IDL.Float64,
    'signupTokenSum' : IDL.Nat,
    'playerID' : IDL.Principal,
    'tierTokenSum' : IDL.Nat,
    'currentTier' : Tier,
    'topTokenAmount' : IDL.Tuple(IDL.Nat, IDL.Text),
    'playerName' : IDL.Text,
    'singupLink' : IDL.Text,
    'topPosition' : IDL.Nat,
    'netWorth' : IDL.Nat,
    'topPlayers' : IDL.Vec(TopView),
  });
  const Status = IDL.Variant({
    'complete' : IDL.Null,
    'progress' : IDL.Null,
    'waiting' : IDL.Null,
  });
  const Time = IDL.Int;
  const RMatch = IDL.Record({
    'id' : IDL.Text,
    'fee' : IDL.Float64,
    'status' : Status,
    'date' : Time,
    'name' : IDL.Text,
    'winner' : IDL.Opt(IDL.Principal),
    'entry' : IDL.Float64,
    'player1' : IDL.Principal,
    'player2' : IDL.Opt(IDL.Principal),
    'price' : IDL.Float64,
  });
  const RPlayer = IDL.Record({
    'id' : IDL.Principal,
    'balance' : IDL.Float64,
    'name' : IDL.Text,
  });
  return IDL.Service({
    'ref_account' : IDL.Func([], [IDL.Opt(RefAccount)], ['query']),
    'ref_account_all' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Principal))],
        ['query'],
      ),
    'ref_account_by' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(RefAccount)],
        ['query'],
      ),
    'ref_account_view' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(RefAccView)],
        ['query'],
      ),
    'ref_claim_tier' : IDL.Func([IDL.Principal], [IDL.Bool, IDL.Text], []),
    'ref_claim_top' : IDL.Func(
        [IDL.Principal, IDL.Nat],
        [IDL.Bool, IDL.Text],
        [],
      ),
    'ref_complete_match' : IDL.Func(
        [IDL.Text, IDL.Principal],
        [IDL.Opt(RMatch)],
        [],
      ),
    'ref_create_match' : IDL.Func([RPlayer, IDL.Float64], [RMatch], []),
    'ref_enroll' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Text],
        [IDL.Bool, IDL.Text],
        [],
      ),
    'ref_enroll_by' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Principal, IDL.Text],
        [IDL.Bool, IDL.Text],
        [],
      ),
    'ref_find_match' : IDL.Func([IDL.Text], [IDL.Opt(RMatch)], []),
    'ref_grant_prize' : IDL.Func([RMatch], [IDL.Opt(IDL.Principal)], []),
    'ref_id_gen' : IDL.Func([], [IDL.Principal], []),
    'ref_join_match' : IDL.Func([RPlayer, IDL.Text], [IDL.Opt(RMatch)], []),
    'ref_tier_all' : IDL.Func([], [IDL.Vec(Tier)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
