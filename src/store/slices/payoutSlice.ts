import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PayoutRate {
  type: 'news' | 'blog'
  rate: number
}

interface AuthorPayout {
  author: string
  articleCount: number
  totalPayout: number
  articles: Array<{
    id: string
    title: string
    type: 'news' | 'blog'
    payout: number
  }>
}

interface PayoutState {
  rates: PayoutRate[]
  authorPayouts: AuthorPayout[]
  loading: boolean
  error: string | null
}

const initialState: PayoutState = {
  rates: [
    { type: 'news', rate: 50 },
    { type: 'blog', rate: 75 },
  ],
  authorPayouts: [],
  loading: false,
  error: null,
}

const payoutSlice = createSlice({
  name: 'payout',
  initialState,
  reducers: {
    setRates: (state, action: PayloadAction<PayoutRate[]>) => {
      state.rates = action.payload
    },
    updateRate: (state, action: PayloadAction<PayoutRate>) => {
      const index = state.rates.findIndex(rate => rate.type === action.payload.type)
      if (index !== -1) {
        state.rates[index] = action.payload
      }
    },
    setAuthorPayouts: (state, action: PayloadAction<AuthorPayout[]>) => {
      state.authorPayouts = action.payload
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
  setRates,
  updateRate,
  setAuthorPayouts,
  setLoading,
  setError,
} = payoutSlice.actions

export default payoutSlice.reducer 