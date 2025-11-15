// lib/validation.ts
import Joi from 'joi'
import { RegisterRequest, LoginRequest, GroupCreateRequest, VoteRequest } from './types'

export const registerValidation = Joi.object<RegisterRequest>({
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
})

export const loginValidation = Joi.object<LoginRequest>({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

export const groupValidation = Joi.object<GroupCreateRequest>({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  contributionAmount: Joi.number().integer().min(1000).required(),
  duration: Joi.number().integer().min(4).max(52).required(),
  frequency: Joi.string().valid('weekly', 'monthly').required(),
  memberCap: Joi.number().integer().min(3).max(20).required()
})

export const voteValidation = Joi.object<VoteRequest>({
  candidateId: Joi.string().required(),
  vote: Joi.string().valid('APPROVE', 'REJECT').required()
})