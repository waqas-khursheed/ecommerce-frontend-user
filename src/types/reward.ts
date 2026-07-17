// Mirrors backed/src/modules/rewards/services/user.reward.service.js.
export interface RewardBalance {
  rewards: number;
}

export interface RewardSetting {
  id: number;
  minimum_points: number;
  points: number;
  equal_to: number;
}

export interface RewardsEarningMethod {
  id: number;
  purchase: number;
  equals_to: number;
}

export interface RewardSettings {
  redemptionRules: RewardSetting[];
  earningMethods: RewardsEarningMethod[];
}
