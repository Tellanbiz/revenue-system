import { collectionsTable } from "@/lib/database/schema/collections"
import { collectionStatusEnum, paymentMethodEnum, collectionTypeEnum } from "@/lib/database/schema/collections"

// Types for collections
export type Collection = typeof collectionsTable.$inferSelect
export type NewCollection = typeof collectionsTable.$inferInsert
export type CollectionStatus = typeof collectionStatusEnum.enumValues[number]
export type PaymentMethod = typeof paymentMethodEnum.enumValues[number]
export type CollectionType = typeof collectionTypeEnum.enumValues[number]

export interface CollectionFilters {
  status?: CollectionStatus[]
  type?: CollectionType[]
  paymentMethod?: PaymentMethod[]
  collectorId?: number
  revenueSourceId?: number // Changed from revenueSource string to revenueSourceId number
  assemblyWard?: string
  dateFrom?: Date
  dateTo?: Date
  amountMin?: number
  amountMax?: number
  search?: string
  reconciled?: boolean
}

export interface CollectionStats {
  totalCollections: number
  totalAmount: number
  pendingCollections: number
  pendingAmount: number
  completedCollections: number
  completedAmount: number
  cancelledCollections: number
  cancelledAmount: number
}

// Import functions from get and post modules
export { getCollections, getCollectionById, getCollectionStats, getCollectionsWithFilters, getCollectionSummary, getCollectionsByRevenueSource, getCollectionsByAssembly, searchCollections } from "./get"
export { createCollection, updateCollection, approveCollection, reconcileCollection, cancelCollection, refundCollection } from "./post"