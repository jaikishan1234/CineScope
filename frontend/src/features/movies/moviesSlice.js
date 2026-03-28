import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { movieService } from '../../services/movie.service';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchTrending = createAsyncThunk('movies/fetchTrending', async (params, { rejectWithValue }) => {
  try {
    const res = await movieService.getTrending(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch trending');
  }
});

export const fetchPopular = createAsyncThunk('movies/fetchPopular', async (params, { rejectWithValue }) => {
  try {
    const res = await movieService.getPopular(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch popular');
  }
});

export const fetchTopRated = createAsyncThunk('movies/fetchTopRated', async (params, { rejectWithValue }) => {
  try {
    const res = await movieService.getTopRated(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch top rated');
  }
});

export const fetchNowPlaying = createAsyncThunk('movies/fetchNowPlaying', async (params, { rejectWithValue }) => {
  try {
    const res = await movieService.getNowPlaying(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch now playing');
  }
});

export const fetchPopularTV = createAsyncThunk('movies/fetchPopularTV', async (params, { rejectWithValue }) => {
  try {
    const res = await movieService.getPopularTV(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch TV shows');
  }
});

export const fetchMovieDetails = createAsyncThunk('movies/fetchDetails', async ({ mediaType, id }, { rejectWithValue }) => {
  try {
    const res = await movieService.getDetails(mediaType, id);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch movie details');
  }
});

export const searchMovies = createAsyncThunk('movies/search', async ({ query, page }, { rejectWithValue }) => {
  try {
    const res = await movieService.search(query, page);
    return { ...res.data.data, query };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Search failed');
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    trending: { results: [], isLoading: false, error: null },
    popular: { results: [], isLoading: false, error: null },
    topRated: { results: [], isLoading: false, error: null },
    nowPlaying: { results: [], isLoading: false, error: null },
    popularTV: { results: [], isLoading: false, error: null },
    current: { data: null, isLoading: false, error: null },
    search: { results: [], query: '', totalPages: 0, isLoading: false, error: null },
  },
  reducers: {
    clearCurrentMovie: (state) => {
      state.current = { data: null, isLoading: false, error: null };
    },
    clearSearchResults: (state) => {
      state.search = { results: [], query: '', totalPages: 0, isLoading: false, error: null };
    },
  },
  extraReducers: (builder) => {
    const asyncCases = [
      [fetchTrending, 'trending'],
      [fetchPopular, 'popular'],
      [fetchTopRated, 'topRated'],
      [fetchNowPlaying, 'nowPlaying'],
      [fetchPopularTV, 'popularTV'],
    ];

    asyncCases.forEach(([thunk, key]) => {
      builder
        .addCase(thunk.pending, (state) => { state[key].isLoading = true; })
        .addCase(thunk.fulfilled, (state, action) => {
          state[key].isLoading = false;
          state[key].results = action.payload.results;
          state[key].error = null;
        })
        .addCase(thunk.rejected, (state, action) => {
          state[key].isLoading = false;
          state[key].error = action.payload;
        });
    });

    // Movie details
    builder
      .addCase(fetchMovieDetails.pending, (state) => { state.current.isLoading = true; })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.current.isLoading = false;
        state.current.data = action.payload;
        state.current.error = null;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.current.isLoading = false;
        state.current.error = action.payload;
      });

    // Search
    builder
      .addCase(searchMovies.pending, (state) => { state.search.isLoading = true; })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.search.isLoading = false;
        state.search.results = action.payload.results;
        state.search.totalPages = action.payload.total_pages;
        state.search.query = action.payload.query;
        state.search.error = null;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.search.isLoading = false;
        state.search.error = action.payload;
      });
  },
});

export const { clearCurrentMovie, clearSearchResults } = moviesSlice.actions;
export default moviesSlice.reducer;
