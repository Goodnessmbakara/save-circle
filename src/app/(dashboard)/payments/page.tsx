"use client"

import { useMemo, useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { QRCode } from "@/components/qr-code"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppStore } from "@/store/use-app-store"
import { createPaymentInvoice, verifyPayment } from "@/api/payments"
import type { PaymentEntry } from "@/types"

const PaymentsPage = () => {
  const { payments, markPaymentPaid } = useAppStore()
  const [selectedPayment, setSelectedPayment] = useState<PaymentEntry | null>(null)
  const [invoiceLoading, setInvoiceLoading] = useState(false)
  const [invoiceData, setInvoiceData] = useState<{ invoice: string; status: string } | null>(null)
  const [verifying, setVerifying] = useState(false)

  const upcoming = useMemo(() => payments.filter((p) => p.status !== "Paid"), [payments])

  useEffect(() => {
    if (selectedPayment && selectedPayment.invoice) {
      setInvoiceData({ invoice: selectedPayment.invoice, status: "waiting" })
      setInvoiceLoading(false)
    } else if (selectedPayment && !selectedPayment.invoice) {
      setInvoiceData(null)
    }
  }, [selectedPayment])

  const handlePayNow = async (payment: PaymentEntry) => {
    setSelectedPayment(payment)
    if (!payment.invoice) {
      setInvoiceLoading(true)
      try {
        const result = await createPaymentInvoice(payment.id)
        setInvoiceData(result)
        setInvoiceLoading(false)
      } catch (error) {
        console.error("Failed to generate invoice:", error)
        setInvoiceLoading(false)
      }
    }
  }

  const handleVerifyPayment = async () => {
    if (!selectedPayment || !invoiceData) return
    setVerifying(true)
    try {
      await verifyPayment(selectedPayment.id)
      markPaymentPaid(selectedPayment.id)
      setSelectedPayment(null)
      setInvoiceData(null)
    } catch (error) {
      console.error("Failed to verify payment:", error)
    } finally {
      setVerifying(false)
    }
  }

  const handleConfirmPayment = () => {
    if (!selectedPayment) return
    markPaymentPaid(selectedPayment.id)
    setSelectedPayment(null)
    setInvoiceData(null)
  }

  const invoiceString = invoiceData?.invoice || selectedPayment?.invoice || ""

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Lightning payments</h1>
        <p className="text-muted-foreground">
          Generate invoices, scan QR codes, and update trust score after each contribution.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcoming.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.groupName}</TableCell>
                  <TableCell>{payment.dueDate}</TableCell>
                  <TableCell>{payment.amountBtc} BTC</TableCell>
                  <TableCell>
                    <Badge variant={payment.status === "Late" ? "destructive" : "secondary"}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => handlePayNow(payment)}>
                      Pay now
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment history</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments
                .filter((payment) => payment.status === "Paid")
                .map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.groupName}</TableCell>
                    <TableCell>{payment.dueDate}</TableCell>
                    <TableCell>{payment.amountBtc} BTC</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Paid</Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay contribution</DialogTitle>
            <DialogDescription>
              Lightning invoice for {selectedPayment?.groupName} due {selectedPayment?.dueDate}
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              {invoiceLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <>
                  {invoiceString && (
                    <>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Lightning Invoice</p>
                        <div className="rounded-xl border bg-muted/40 p-4 font-mono text-xs break-all">
                          {invoiceString}
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <QRCode value={invoiceString} size={256} className="max-w-full" />
                      </div>
                      <Alert>
                        <AlertTitle>Payment Instructions</AlertTitle>
                        <AlertDescription>
                          Scan the QR code with your Lightning wallet or copy the invoice string
                          above. After payment is confirmed on-chain, click "Verify Payment" below.
                        </AlertDescription>
                      </Alert>
                    </>
                  )}
                  <Alert>
                    <AlertTitle>Status</AlertTitle>
                    <AlertDescription>
                      {selectedPayment.status === "Paid"
                        ? "Payment confirmed"
                        : invoiceData?.status === "confirmed"
                          ? "Payment verified on-chain"
                          : "Waiting for payment... verify once payment is sent."}
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-2">
                    <Button onClick={handleVerifyPayment} disabled={verifying || selectedPayment.status === "Paid"}>
                      {verifying ? "Verifying..." : "Verify Payment"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleConfirmPayment}
                      disabled={selectedPayment.status === "Paid"}
                    >
                      Mark as paid
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PaymentsPage
