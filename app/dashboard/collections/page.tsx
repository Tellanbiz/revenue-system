"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Download,
  Plus,
} from "lucide-react"
import {
  getCollectionsWithFilters,
  type CollectionFilters,
  type Collection,
  type CollectionStatus,
  type PaymentMethod,
  type CollectionType,
} from "@/lib/services/collections/actions"
import { getRevenueSources } from "@/lib/services/sources/actions"
import { CollectionTable } from "@/components/features/collection/collection-table"
import { TopNavigation } from "@/components/navigation/top-navigation"
import Link from "next/link"

export default function CollectionsPage() {
  const router = useRouter()
  const [collections, setCollections] = useState<Collection[]>([])
  const [revenueSources, setRevenueSources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<CollectionFilters>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Load data on mount and when filters change
  useEffect(() => {
    loadCollections()
    loadRevenueSources()
  }, [filters, currentPage])

  const loadCollections = async () => {
    try {
      setLoading(true)
      const result = await getCollectionsWithFilters(
        { ...filters, search: searchTerm || undefined },
        currentPage,
        20
      )
      setCollections(result.collections)
      setTotalCount(result.totalCount)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error("Failed to load collections:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadRevenueSources = async () => {
    try {
      const sources = await getRevenueSources()
      setRevenueSources(sources)
    } catch (error) {
      console.error("Failed to load revenue sources:", error)
    }
  }

  const handleFilterChange = (key: keyof CollectionFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation>
        <Link href="/dashboard/collections/new">
        <Button variant="default" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Collection
        </Button> 
        </Link>       

        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </TopNavigation>
    

      {/* Main Content */}
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Collections Table */}
          <CollectionTable
            collections={collections}
            revenueSources={revenueSources}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={setCurrentPage}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  )
}