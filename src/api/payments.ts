import { mockPayments } from "@/data/mock-data"
import { mockRequest } from "./mock-request"

export const getPayments = async () => mockRequest(mockPayments)

export const createPaymentInvoice = async (paymentId: string) => {
  const payment = mockPayments.find((item) => item.id === paymentId)
  return mockRequest({
    paymentId,
    invoice:
      payment?.invoice ??
      `lnbc${Math.floor(Math.random() * 1000000)}n1pw${paymentId}`,
    status: "waiting",
  })
}

export const verifyPayment = async (paymentId: string) =>
  mockRequest({
    paymentId,
    status: "confirmed",
    confirmedAt: new Date().toISOString(),
  })

