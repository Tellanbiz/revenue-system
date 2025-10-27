"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  RefreshCw
} from "lucide-react"
import { SourceSubmitDialog } from "@/components/features/sources/source-submit-dialog"
import {
  getRevenueSources,
  searchRevenueSources,
  deleteRevenueSource
} from "@/lib/services/sources/actions"

interface RevenueSource {
  id: number
  code: string
  name: string
  type: 'market' | 'permit' | 'license' | 'property' | 'utility' | 'fine' | 'other'
  category: string | null
  subcategory: string | null
  description: string | null
  requirements: string | null
  applicable_to: string | null
  responsible_department: string | null
  applicable_assemblies: string | null
  standard_rate: string | null
  minimum_amount: string | null
  maximum_amount: string | null
  currency: string | null
  frequency: 'one_time' | 'monthly' | 'quarterly' | 'annually' | null
  is_active: boolean
  notes: string | null
  effective_date: Date
  expiry_date: Date | null
  created_at: Date
  updated_at: Date
  created_by: number | null
  updated_by: number | null
}

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

  const handleDeleteSource = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await deleteRevenueSource(id)
      alert(`Revenue source "${name}" deleted successfully`)
      loadSources()
    } catch (err) {
      console.error("Error deleting source:", err)
      alert("Failed to delete revenue source")
    }
  }

  const handleAddSource = () => {
    alert("Add source functionality coming soon!")
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="container mx-auto py-8 px-6">
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
            <div className="text-sm text-muted-foreground">
              {filteredSources.length} sources
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
            <SourceSubmitDialog onSourceCreated={loadSources} />
          </div>
        </div>

        {/* Sources List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {error && (
            <div className="col-span-full">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={loadSources} variant="outline">
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {isLoading && (
            <div className="col-span-full">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Loading revenue sources...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!isLoading && !error && filteredSources.length === 0 && (
            <div className="col-span-full">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    {searchTerm ? (
                      <div>
                        <p className="text-muted-foreground mb-4">
                          No revenue sources found matching "{searchTerm}"
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setSearchTerm("")}
                        >
                          Clear Search
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-muted-foreground mb-4">
                          No revenue sources found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Get started by adding your first revenue source
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!isLoading && !error && filteredSources.map((source) => (
            <Card key={source.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{source.name}</CardTitle>
                    <CardDescription className="font-mono text-sm">
                      Code: {source.code}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded capitalize">
                        {source.type.replace('_', ' ')}
                      </span>
                      {source.frequency && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded capitalize">
                          {source.frequency.replace('_', ' ')}
                        </span>
                      )}
                      {!source.is_active && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <CardDescription className="mt-2">
                      Created {formatDate(source.created_at)}
                      {source.category && (
                        <span className="ml-2">• {source.category}</span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => alert("Edit functionality coming soon")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSource(source.id, source.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {source.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {source.description}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  {source.standard_rate && (
                    <div>
                      <span className="font-medium">Rate:</span> {source.currency || 'GHS'} {source.standard_rate}
                    </div>
                  )}
                  {source.applicable_to && (
                    <div>
                      <span className="font-medium">Applies to:</span> {source.applicable_to}
                    </div>
                  )}
                  {source.responsible_department && (
                    <div>
                      <span className="font-medium">Department:</span> {source.responsible_department}
                    </div>
                  )}
                  {source.effective_date && (
                    <div>
                      <span className="font-medium">Effective:</span> {formatDate(source.effective_date)}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                  Last updated: {formatDate(source.updated_at)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        {!isLoading && !error && sources.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-600">{sources.length}</div>
                <p className="text-sm text-muted-foreground">Total Revenue Sources</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {sources.filter(s => s.description).length}
                </div>
                <p className="text-sm text-muted-foreground">With Descriptions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">
                  {sources.length > 0 ? Math.round((sources.filter(s => s.description).length / sources.length) * 100) : 0}%
                </div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}