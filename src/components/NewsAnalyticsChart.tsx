"use client"

import { Bar } from 'react-chartjs-2'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function NewsAnalyticsChart() {
  const { filteredArticles } = useSelector((state: RootState) => state.news)

  // Count articles by author
  const authorCounts: Record<string, number> = {}
  filteredArticles.forEach((article: any) => {
    const author = article.author || 'Unknown'
    authorCounts[author] = (authorCounts[author] || 0) + 1
  })

  const data = {
    labels: Object.keys(authorCounts),
    datasets: [
      {
        label: 'Articles by Author',
        data: Object.values(authorCounts),
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // blue-600
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Article Count by Author',
        color: '#000',
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        ticks: { color: '#000' },
        title: { display: true, text: 'Author', color: '#000' },
      },
      y: {
        ticks: { color: '#000' },
        title: { display: true, text: 'Articles', color: '#000' },
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="bg-white rounded shadow p-4 my-8">
      <Bar data={data} options={options} height={300} />
    </div>
  )
} 