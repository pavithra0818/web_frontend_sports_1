"use client"

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { setArticles, setFilters, setFilteredArticles, setLoading, setError } from '@/store/slices/newsSlice'
import { format, parseISO } from 'date-fns'

export default function NewsDashboard() {
  const dispatch = useDispatch()
  const { articles, filteredArticles, filters, loading, error } = useSelector((state: RootState) => state.news) as RootState['news']
  const [search, setSearch] = useState('')
  const [author, setAuthor] = useState('')
  const [type, setType] = useState('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    dispatch(setLoading(true))
    try {
      const params = new URLSearchParams({
        q: search || 'technology',
        author,
        type,
        from,
        to,
      })
      const res = await fetch(`/api/news?${params.toString()}`)
      const data = await res.json()
      dispatch(setArticles(data.articles))
      dispatch(setFilteredArticles(data.articles))
      dispatch(setError(null))
    } catch (err) {
      dispatch(setError('Failed to fetch news.'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleFilter = () => {
    fetchArticles()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end bg-white dark:bg-gray-800 p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium text-black dark:text-gray-200">Search</label>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="border rounded px-2 py-1 text-black dark:text-gray-100 bg-white dark:bg-gray-900" placeholder="Keyword..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-black dark:text-gray-200">Author</label>
          <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="border rounded px-2 py-1 text-black dark:text-gray-100 bg-white dark:bg-gray-900" placeholder="Author..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-black dark:text-gray-200">Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-2 py-1 text-black dark:text-gray-100 bg-white dark:bg-gray-900">
            <option value="all">All</option>
            <option value="news">News</option>
            <option value="blog">Blog</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-black dark:text-gray-200">From</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border rounded px-2 py-1 text-black dark:text-gray-100 bg-white dark:bg-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-black dark:text-gray-200">To</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border rounded px-2 py-1 text-black dark:text-gray-100 bg-white dark:bg-gray-900" />
        </div>
        <button onClick={handleFilter} className="bg-blue-600 text-white px-4 py-2 rounded">Apply</button>
      </div>
      {loading && <div>Loading articles...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-100 rounded shadow text-black dark:text-gray-900">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-200">
              <th className="px-4 py-2 font-semibold">Title</th>
              <th className="px-4 py-2 font-semibold">Author</th>
              <th className="px-4 py-2 font-semibold">Date</th>
              <th className="px-4 py-2 font-semibold">Type</th>
              <th className="px-4 py-2 font-semibold">Source</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article: any, idx: number) => (
              <tr key={idx} className="border-t bg-white hover:bg-gray-50 dark:bg-gray-200">
                <td className="px-4 py-2 max-w-xs truncate">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {article.title}
                  </a>
                </td>
                <td className="px-4 py-2">{article.author || '-'}</td>
                <td className="px-4 py-2">{article.publishedAt ? format(parseISO(article.publishedAt), 'yyyy-MM-dd') : '-'}</td>
                <td className="px-4 py-2">{/(blog)/i.test(article.source.name) ? 'Blog' : 'News'}</td>
                <td className="px-4 py-2">{article.source.name}</td>
              </tr>
            ))}
            {filteredArticles.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">No articles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="text-sm text-gray-600 mt-2">Total articles: {filteredArticles.length}</div>
    </div>
  )
} 