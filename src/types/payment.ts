// Mirrors backed/src/modules/payments/controllers/user.cardDetail.controller.js checkCardDiscount.
export interface CardDiscountCheck {
  eligible: boolean;
  percentage: number;
  bank?: { id: number; bank_title: string };
  cardCategory?: { id: number; card_category: string };
  cardType?: { id: number; card_type: string };
}
