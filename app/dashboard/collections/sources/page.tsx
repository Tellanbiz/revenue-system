"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  RefreshCw
} from "lucide-react"
import { SourceTable, type RevenueSource } from "@/components/features/sources/source-table"
import { SourceSubmitDialog } from "@/components/features/sources/source-submit-dialog"
import {
  getRevenueSources,
  searchRevenueSources,
  deleteRevenueSource
} from "@/lib/services/sources/actions"
import { TopNavigation } from "@/components/navigation/top-navigation"

export default function SourcesPage() {
  const [sources, setSources] = useState<RevenueSource[]>([])
  const [filteredSources, setFilteredSources] = useState<RevenueSource[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSources = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getRevenueSources(100)
      setSources(data)
      setFilteredSources(data)
    } catch (err) {
      setError("Failed to load revenue sources")
      console.error("Error loading sources:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSources()
  }, [])

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = sources.filter(source =>
        source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        source.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (source.description && source.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredSources(filtered)
    } else {
      setFilteredSources(sources)
    }
  }, [searchTerm, sources])

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.trim().length >= 2) {
      try {
        const results = await searchRevenueSources(term)
        setFilteredSources(results)
      } catch (err) {
        console.error("Search failed:", err)
      }
    }
  }

  const handleEditSource = (source: RevenueSource) => {
    alert("Edit functionality coming soon!")
  }

  const handleDeleteSource = async (source: RevenueSource) => {
    if (!confirm(`Are you sure you want to delete "${source.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await deleteRevenueSource(source.id)
      alert(`Revenue source "${source.name}" deleted successfully`)
      loadSources()
    } catch (err) {
      console.error("Error deleting source:", err)
      alert("Failed to delete revenue source")
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation>
        <SourceSubmitDialog onSourceCreated={loadSources} />
      </TopNavigation>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header with Search */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, code, or description..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
  
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={loadSources}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Sources Table */}
          <SourceTable
            sources={filteredSources}
            loading={isLoading}
            onEdit={handleEditSource}
            onDelete={handleDeleteSource}
          />

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadSources} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {!isLoading && !error && filteredSources.length === 0 && (
            <div className="text-center py-8">
              {searchTerm ? (
                <div>
                  <p className="text-muted-foreground mb-4">
                    No sources found matching "{searchTerm}"
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No revenue sources found
                </p>
              )}
            </div>
          )}


        </div>
      </div>
    </div>
  )
}