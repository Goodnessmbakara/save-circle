// lib/types.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  mavapayWalletId?: string;
  isVerified: boolean;
  trustScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  adminId: string;
  contributionAmount: number;
  duration: number;
  frequency: 'weekly' | 'monthly';
  memberCap: number;
  isOpen: boolean;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  cycleNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  joinDate?: Date;
  trustScore: number;
  totalContributions: number;
  hasDefaulted: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  groupId: string;
  cycleNumber: number;
  amount: number;
  lightningInvoice?: string;
  paymentHash?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'FAILED';
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
}

export interface Payout {
  id: string;
  userId: string;
  groupId: string;
  cycleNumber: number;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED';
  mavapayRef?: string;
  paidAt?: Date;
  trustScoreAtPayout: number;
  createdAt: Date;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GroupCreateRequest {
  name: string;
  description?: string;
  contributionAmount: number;
  duration: number;
  frequency: 'weekly' | 'monthly';
  memberCap: number;
}

export interface VoteRequest {
  candidateId: string;
  vote: 'APPROVE' | 'REJECT';
}

export interface AuthenticatedRequest extends Request {
  userId: string;
}