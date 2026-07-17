// Mirrors backed/src/modules/exchanges/validations/exchange.validation.js createExchangeSchema.
export interface ExchangeRequestPayload {
  order_number: string;
  customer_name: string;
  return_item_code?: string;
  return_item_name?: string;
  return_item_size?: string;
  email?: string;
  phone_number?: string;
  date?: string;
  reason?: string;
  other_detail?: string;
  required_item_code?: string;
  required_item_name?: string;
  required_item_size?: string;
}
