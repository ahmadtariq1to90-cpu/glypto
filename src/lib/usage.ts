/**
 * ProToolix Usage Limit System
 * Handles tool usage tracking, 24-hour resets, and ad-based unlocking.
 */

const USAGE_KEY = "protoolix_usage_data";
const LIMIT = 5;
const RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface UsageData {
  counts: Record<string, number>;
  lastReset: number;
}

const getUsageData = (): UsageData => {
  const data = localStorage.getItem(USAGE_KEY);
  if (!data) {
    return { counts: {}, lastReset: Date.now() };
  }
  return JSON.parse(data);
};

const saveUsageData = (data: UsageData) => {
  localStorage.setItem(USAGE_KEY, JSON.stringify(data));
};

/**
 * Checks if usage should be reset (24h passed)
 */
export const checkAndResetUsage = () => {
  const data = getUsageData();
  const now = Date.now();
  
  if (now - data.lastReset > RESET_INTERVAL) {
    saveUsageData({ counts: {}, lastReset: now });
    return true;
  }
  return false;
};

/**
 * Gets current usage count for a tool
 */
export const getToolUsage = (toolId: string): number => {
  checkAndResetUsage();
  const data = getUsageData();
  return data.counts[toolId] || 0;
};

/**
 * Checks if a tool can be used
 */
export const canUseTool = (toolId: string): boolean => {
  const count = getToolUsage(toolId);
  return count < LIMIT;
};

/**
 * Increments usage for a tool
 */
export const incrementToolUsage = (toolId: string) => {
  const data = getUsageData();
  data.counts[toolId] = (data.counts[toolId] || 0) + 1;
  saveUsageData(data);
};

/**
 * Unlocks one more use by watching an ad
 */
export const unlockWithAd = (toolId: string) => {
  const data = getUsageData();
  // We "unlock" by decrementing the count so it's below the limit again
  // or we could increase a separate "bonus" count. 
  // The requirement says "Increase usage count by +1" but that would make it harder to use?
  // Actually, the requirement says: "After ad interaction: Allow tool to run again".
  // So we just set it back to LIMIT - 1.
  data.counts[toolId] = LIMIT - 1;
  saveUsageData(data);
};
