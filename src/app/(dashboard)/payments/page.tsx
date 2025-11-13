"use client"

import { useMemo, useState } from "react"
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
import { useAppStore } from "@/store/use-app-store"
import type { PaymentEntry } from "@/types"

const PaymentsPage = () => {
  const { payments, markPaymentPaid } = useAppStore()
  const [selectedPayment, setSelectedPayment] = useState<PaymentEntry | null>(null)

  const upcoming = useMemo(() => payments.filter((p) => p.status !== "Paid"), [payments])

  const handleConfirmPayment = () => {
    if (!selectedPayment) return
    markPaymentPaid(selectedPayment.id)
    setSelectedPayment(null)
  }

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
                    <Button size="sm" onClick={() => setSelectedPayment(payment)}>
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
              <div className="rounded-xl border bg-muted/40 p-4 font-mono text-sm break-all">
                {selectedPayment.invoice}
              </div>
              <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
                QR code area
              </div>
              <Alert>
                <AlertTitle>Status</AlertTitle>
                <AlertDescription>
                  {selectedPayment.status === "Paid"
                    ? "Payment confirmed"
                    : "Waiting for payment... click confirm once sats are sent."}
                </AlertDescription>
              </Alert>
              <Button onClick={handleConfirmPayment}>Mark as paid</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PaymentsPage
