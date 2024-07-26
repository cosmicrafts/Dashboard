export const idlFactory = ({ IDL }) => {
  const Token = IDL.Record({ 'title' : IDL.Text, 'amount' : IDL.Nat });
  const TierID = IDL.Nat;
  const Tier = IDL.Record({
    'id' : TierID,
    'status' : IDL.Text,
    'title' : IDL.Text,
    'token' : Token,
    'desc' : IDL.Text,
  });
  const UUID = IDL.Text;
  const RefAccount = IDL.Record({
    'multiplier' : IDL.Float64,
    'tiers' : IDL.Vec(Tier),
    'playerID' : IDL.Principal,
    'uuid' : UUID,
    'refByUUID' : UUID,
    'tokens' : IDL.Vec(Token),
    'netWorth' : IDL.Float64,
  });
  return IDL.Service({
    'calculateDynamicMultiplier' : IDL.Func([IDL.Nat], [IDL.Float64], []),
    'calculateNetWorth' : IDL.Func([IDL.Vec(Token)], [IDL.Float64], []),
    'claimTierToken' : IDL.Func([IDL.Principal], [IDL.Bool, IDL.Text], []),
    'enrollByPrincipal' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Principal],
        [IDL.Bool, IDL.Text],
        [],
      ),
    'enrollPlayer' : IDL.Func([IDL.Opt(IDL.Text)], [IDL.Bool, IDL.Text], []),
    'generateRandomPrincipal' : IDL.Func([], [IDL.Principal], []),
    'getAccount' : IDL.Func([], [IDL.Opt(RefAccount)], ['query']),
    'getAllAccounts' : IDL.Func([], [IDL.Vec(RefAccount)], ['query']),
    'getAlltiers' : IDL.Func([], [IDL.Vec(Tier)], ['query']),
    'getCurrentPlayerTier' : IDL.Func([IDL.Principal], [IDL.Opt(Tier)], []),
    'getTopPlayers' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(IDL.Tuple(IDL.Principal, RefAccount))],
        [],
      ),
    'signupLinkShare' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
