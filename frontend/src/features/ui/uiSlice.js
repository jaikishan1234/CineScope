import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    trailerModal: {
      isOpen: false,
      videoKey: null,
      movieTitle: null,
      movieId: null,
      mediaType: null,
    },
    theme: localStorage.getItem('theme') || 'dark',
    sidebarOpen: false,
  },
  reducers: {
    openTrailerModal: (state, action) => {
      state.trailerModal.isOpen = true;
      state.trailerModal.videoKey = action.payload.videoKey ?? null;
      state.trailerModal.movieTitle = action.payload.movieTitle ?? null;
      state.trailerModal.movieId = action.payload.movieId ?? null;
      state.trailerModal.mediaType = action.payload.mediaType ?? null;
    },
    closeTrailerModal: (state) => {
      state.trailerModal.isOpen = false;
      state.trailerModal.videoKey = null;
      state.trailerModal.movieTitle = null;
      state.trailerModal.movieId = null;
      state.trailerModal.mediaType = null;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { openTrailerModal, closeTrailerModal, toggleTheme, setTheme, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
