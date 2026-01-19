'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { adminApi } from '@/lib/admin-api';
import type { AdminPortfolioListItem, PaginatedResponse } from '@/types/admin';
import { Eye, Globe, GlobeLock, Trash2 } from 'lucide-react';

export default function PortfoliosPage() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<PaginatedResponse<AdminPortfolioListItem>>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<boolean | ''>('');
  const pageSize = 20;

  const [unpublishConfirmOpen, setUnpublishConfirmOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<AdminPortfolioListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadPortfolios = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.getPortfolios({
        page,
        page_size: pageSize,
        search: search || undefined,
        published: publishedFilter === '' ? undefined : publishedFilter,
      });
      setPortfolios(data);
    } catch (err) {
      console.error('Failed to load portfolios:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, publishedFilter]);

  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1);
  };

  const handleUnpublish = async () => {
    if (!selectedPortfolio) return;
    try {
      setActionLoading(true);
      await adminApi.unpublishPortfolio(selectedPortfolio.id);
      await loadPortfolios();
      setUnpublishConfirmOpen(false);
    } catch (err) {
      console.error('Failed to unpublish:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: 'user_email',
      header: 'User',
      render: (portfolio: AdminPortfolioListItem) => (
        <span className="text-zinc-200">{portfolio.user_email}</span>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (portfolio: AdminPortfolioListItem) => (
        <span className="text-zinc-300 font-medium">{portfolio.title || 'Untitled'}</span>
      ),
    },
    {
      key: 'username',
      header: 'Username',
      render: (portfolio: AdminPortfolioListItem) => (
        <span className="text-violet-400 text-sm">{portfolio.username || '-'}</span>
      ),
    },
    {
      key: 'theme',
      header: 'Theme',
      render: (portfolio: AdminPortfolioListItem) => (
        <span className="text-zinc-500 text-xs">{portfolio.theme}</span>
      ),
    },
    {
      key: 'is_published',
      header: 'Status',
      render: (portfolio: AdminPortfolioListItem) => (
        portfolio.is_published ? (
          <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs">
            <Globe className="w-3.5 h-3.5" />
            Published
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-zinc-500 text-xs">
            <GlobeLock className="w-3.5 h-3.5" />
            Draft
          </span>
        )
      ),
    },
    {
      key: 'updated_at',
      header: 'Updated',
      render: (portfolio: AdminPortfolioListItem) => (
        <span className="text-zinc-500 text-xs">
          {new Date(portfolio.updated_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const filters = (
    <select
      value={publishedFilter === '' ? '' : publishedFilter ? 'true' : 'false'}
      onChange={(e) => {
        setPublishedFilter(e.target.value === '' ? '' : e.target.value === 'true');
        setPage(1);
      }}
      className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-violet-500"
    >
      <option value="">All Status</option>
      <option value="true">Published</option>
      <option value="false">Draft</option>
    </select>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Portfolios</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Manage user portfolios and snapshots
        </p>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={portfolios.results}
        loading={loading}
        totalCount={portfolios.count}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onSearch={handleSearch}
        searchPlaceholder="Search by email, title, or username..."
        emptyMessage="No portfolios found"
        getRowKey={(portfolio) => portfolio.id}
        onRowClick={(portfolio) => router.push(`/admin/portfolios/${portfolio.id}`)}
        filters={filters}
        actions={(portfolio) => (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/admin/portfolios/${portfolio.id}`);
              }}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              title="View details"
            >
              <Eye className="w-4 h-4" />
            </button>
            {portfolio.is_published && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPortfolio(portfolio);
                  setUnpublishConfirmOpen(true);
                }}
                className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                title="Unpublish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      />

      {/* Unpublish Confirm */}
      <ConfirmDialog
        open={unpublishConfirmOpen}
        onClose={() => setUnpublishConfirmOpen(false)}
        onConfirm={handleUnpublish}
        title="Unpublish Portfolio"
        description={`Are you sure you want to unpublish "${selectedPortfolio?.title || 'this portfolio'}"? It will no longer be accessible publicly.`}
        confirmText="Unpublish"
        variant="danger"
        loading={actionLoading}
      />
    </div>
  );
}
