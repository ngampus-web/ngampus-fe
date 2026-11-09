import { ordersApi } from "./orders"

/** Payment state belongs to an order; guest access uses its saved token. */
export const paymentApi = {
  createPayment: ordersApi.pay,
  getPaymentStatus: ordersApi.get,
}
