"use client"

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { setRates, updateRate, setAuthorPayouts } from '@/store/slices/payoutSlice'
import jsPDF from 'jspdf'
import Papa from 'papaparse'

function getLocalRates() {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('payoutRates')
    if (data) return JSON.parse(data)
  }
  return null
}

function setLocalRates(rates: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('payoutRates', JSON.stringify(rates))
  }
}

export default function PayoutCalculator() {
  const dispatch = useDispatch()
  const { rates } = useSelector((state: RootState) => state.payout)
  const { filteredArticles } = useSelector((state: RootState) => state.news)
  const [localRates, setLocalRatesState] = useState(rates)

  useEffect(() => {
    const stored = getLocalRates()
    if (stored) {
      setLocalRatesState(stored)
      dispatch(setRates(stored))
    }
  }, [dispatch])

  useEffect(() => {
    setLocalRates(localRates)
    dispatch(setRates(localRates))
  }, [localRates, dispatch])

  // Calculate payouts per author
  const authorMap: Record<string, { count: number; payout: number; articles: any[] }> = {}
  filteredArticles.forEach((article: any) => {
    const author = article.author || 'Unknown'
    const type = /blog/i.test(article.source.name) ? 'blog' : 'news'
    const rate = localRates.find((r: any) => r.type === type)?.rate || 0
    if (!authorMap[author]) authorMap[author] = { count: 0, payout: 0, articles: [] }
    authorMap[author].count++
    authorMap[author].payout += rate
    authorMap[author].articles.push({
      title: article.title,
      type,
      payout: rate,
    })
  })
  const authorPayouts = Object.entries(authorMap).map(([author, data]) => ({
    author,
    articleCount: data.count,
    totalPayout: data.payout,
    articles: data.articles,
  }))

  // Export as CSV
  const handleExportCSV = () => {
    const csv = Papa.unparse(
      authorPayouts.map(a => ({
        Author: a.author,
        'Article Count': a.articleCount,
        'Total Payout': a.totalPayout,
      }))
    )
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'payout_report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Export as PDF
  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.text('Payout Report', 10, 10)
    let y = 20
    authorPayouts.forEach(a => {
      doc.text(`Author: ${a.author} | Articles: ${a.articleCount} | Total: $${a.totalPayout}`, 10, y)
      y += 10
    })
    doc.save('payout_report.pdf')
  }

  // Placeholder for Google Sheets integration
  const handleExportGoogleSheets = () => {
    alert('Google Sheets integration is a placeholder. Implement OAuth and Sheets API for real export.')
  }

  const handleRateChange = (type: string, value: number) => {
    const updated = localRates.map((r: any) => r.type === type ? { ...r, rate: value } : r)
    setLocalRatesState(updated)
  }

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-lg font-bold text-black mb-2">Payout Calculator</h2>
      <div className="flex gap-4 items-end">
        {localRates.map((rate: any) => (
          <div key={rate.type}>
            <label className="block text-sm font-medium text-black capitalize">{rate.type} rate ($)</label>
            <input
              type="number"
              min={0}
              value={rate.rate}
              onChange={e => handleRateChange(rate.type, Number(e.target.value))}
              className="border rounded px-2 py-1 text-black"
            />
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow text-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 font-semibold">Author</th>
              <th className="px-4 py-2 font-semibold">Article Count</th>
              <th className="px-4 py-2 font-semibold">Total Payout ($)</th>
            </tr>
          </thead>
          <tbody>
            {authorPayouts.map((a, idx) => (
              <tr key={idx} className="border-t bg-white hover:bg-gray-50">
                <td className="px-4 py-2">{a.author}</td>
                <td className="px-4 py-2">{a.articleCount}</td>
                <td className="px-4 py-2">{a.totalPayout}</td>
              </tr>
            ))}
            {authorPayouts.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">No payout data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4 mt-2">
        <button onClick={handleExportCSV} className="bg-green-600 text-white px-4 py-2 rounded">Export CSV</button>
        <button onClick={handleExportPDF} className="bg-red-600 text-white px-4 py-2 rounded">Export PDF</button>
        <button onClick={handleExportGoogleSheets} className="bg-blue-600 text-white px-4 py-2 rounded">Export to Google Sheets</button>
      </div>
    </div>
  )
} 