// trust.js

// Default structure
const defaultTrust = {
  blueKeys: 0,
  goldKeys: 0,
  shares: 0,
  lastSeen: new Date().toISOString(),
  trustScore: 0, // calculated
};

// Load from localStorage or fallback to default
export function getTrustData() {
  const data = localStorage.getItem('tiffyTrust');
  try {
    return data ? JSON.parse(data) : { ...defaultTrust };
  } catch {
    return { ...defaultTrust };
  }
}

// Save trust data
export function saveTrustData(data) {
  data.lastSeen = new Date().toISOString();
  data.trustScore = calculateTrustScore(data);
  localStorage.setItem('tiffyTrust', JSON.stringify(data));
}

// Recalculate trust score based on simple logic
export function calculateTrustScore(data) {
  const { blueKeys, goldKeys, shares } = data;
  let score = 0;

  if (blueKeys >= 3) score += 15;    // unlock Lucky Wheel
  if (blueKeys >= 10) score += 30;   // +1 Gold Key
  if (goldKeys >= 10) score += 40;   // unlock AI Trading
  if (shares >= 10) score += 15;     // consistent sharing

  return Math.min(100, score); // Cap at 100
}

// Add a Blue Key
export function addBlueKey() {
  const data = getTrustData();
  data.blueKeys += 1;

  // Convert to Gold Key every 10 Blue Keys
  if (data.blueKeys >= 10) {
    data.goldKeys += 1;
    data.blueKeys = 0;
  }

  saveTrustData(data);
}

// Add a Share
export function addShare() {
  const data = getTrustData();
  data.shares += 1;
  saveTrustData(data);
}

// Export trust data as a downloadable file
export function exportTrustToFile() {
  const trust = getTrustData();
  const dataStr = JSON.stringify(trust, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'tiffykey.trust.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Import trust data from file
export function importTrustFromFile(file, callback) {
  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const imported = JSON.parse(event.target.result);
      if (validateTrustData(imported)) {
        saveTrustData(imported);
        callback(true);
      } else {
        callback(false);
      }
    } catch {
      callback(false);
    }
  };
  reader.readAsText(file);
}

// Validate trust structure
function validateTrustData(data) {
  if (!data) return false;
  const required = ['blueKeys', 'goldKeys', 'shares', 'lastSeen', 'trustScore'];
  return required.every(field => typeof data[field] !== 'undefined');
}
