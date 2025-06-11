import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Article {
  id: string
  title: string
  author: string
  content: string
  publishedAt: string
  type: 'news' | 'blog'
  url: string
  source: string
}

interface NewsState {
  articles: Article[]
  filteredArticles: Article[]
  filters: {
    author: string
    dateRange: {
      start: string
      end: string
    }
    type: 'all' | 'news' | 'blog'
    searchQuery: string
  }
  loading: boolean
  error: string | null
}

const initialState: NewsState = {
  articles: [],
  filteredArticles: [],
  filters: {
    author: '',
    dateRange: {
      start: '',
      end: '',
    },
    type: 'all',
    searchQuery: '',
  },
  loading: false,
  error: null,
}

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload
      state.filteredArticles = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<NewsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setFilteredArticles: (state, action: PayloadAction<Article[]>) => {
      state.filteredArticles = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setArticles,
  setFilters,
  setFilteredArticles,
  setLoading,
  setError,
} = newsSlice.actions

export default newsSlice.reducer 