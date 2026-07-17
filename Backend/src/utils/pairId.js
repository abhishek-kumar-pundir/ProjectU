// Canonical, order-independent identifier for a pair of users.
// getPairId(A, B) === getPairId(B, A) — so it works as both a DB scoping key
// and a private Socket.IO room name. This is what keeps session(A,B) from
// ever touching session(C,D): every query, broadcast, and room join is keyed
// off this value, derived only from ids the server has authenticated.
export const getPairId = (userIdA, userIdB) => {
  return [userIdA.toString(), userIdB.toString()].sort().join("_");
};
