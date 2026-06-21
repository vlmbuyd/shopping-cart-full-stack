export interface AvailableTime {
  startTime: string;
  endTime: string;
}

export interface CouponSummary {
  id: number;
  name: string;
  isSelected: boolean;
  isDisabled: boolean;
  dueDate: string;
  minOrderAmount: number;
  availableTime: AvailableTime;
}
