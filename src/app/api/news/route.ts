import { NextRequest, NextResponse } from 'next/server'

const NEWS_API_KEY = process.env.NEWS_API_KEY
const NEWS_API_URL = 'https://newsapi.org/v2/everything'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || 'technology'
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const author = searchParams.get('author')
  const type = searchParams.get('type')
  const pageSize = searchParams.get('pageSize') || '50'

  let url = `${NEWS_API_URL}?q=${encodeURIComponent(q)}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`
  if (from) url += `&from=${from}`
  if (to) url += `&to=${to}`

  // NewsAPI does not support filtering by author/type directly, so we'll filter after fetching
  const res = await fetch(url)
  const data = await res.json()

  let articles = data.articles || []
  if (author) {
    articles = articles.filter((a: any) => a.author && a.author.toLowerCase().includes(author.toLowerCase()))
  }
  if (type && type !== 'all') {
    // We'll treat 'news' as articles with a source, 'blog' as those with 'blog' in the source name
    articles = articles.filter((a: any) =>
      type === 'news' ? !/blog/i.test(a.source.name) : /blog/i.test(a.source.name)
    )
  }

  return NextResponse.json({ articles })
} 