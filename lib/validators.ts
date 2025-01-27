import { z } from 'zod'

export const CostQueryParams = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(5).max(100).default(20),
  vin: z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/i).optional(),
  type: z.enum(['purchase', 'maintenance', 'insurance', 'other']).optional(),
  startDate: z.dateString().optional(),
  endDate: z.dateString().optional()
}) 