// trust.js

// Initialize or load trust data
export function getTrustData() {
  const saved = localStorage.getItem('tiffyTrust');
  if (saved) return JSON.parse(saved);
  const trust = {
    blueKeys: 0,
    goldKeys: 0,
    shares: 0,
    lastSeen: Date.now(),
    trustScore: 0
  };
  saveTrustData(trust);
  return trust;
}

// Save trust data
export function saveTrustData(data) {
  localStorage.setItem('tiffyTrust', JSON.stringify(data));
}

// Add a claim or share event
export function updateTrust({ blueKey = 0, goldKey = 0, share = 0 }) {
  const trust = getTrustData();
  trust.blueKeys += blueKey;
  trust.goldKeys += goldKey;
  trust.shares += share;
  trust.lastSeen = Date.now();
  trust.trustScore = calculateTrustScore(trust);
  saveTrustData(trust);
}

// Calculate trust score
function calculateTrustScore({ blueKeys, goldKeys, shares }) {
  let score = 0;
  score += blueKeys * 5;   // Each Blue Key is worth 5%
  score += goldKeys * 10;  // Each Gold Key worth 10%
  score += shares * 2;     // Each Share worth 2%
  return Math.min(score, 100); // Max 100%
}

// Clear trust (for dev or reset)
export function resetTrust() {
  localStorage.removeItem('tiffyTrust');
}
