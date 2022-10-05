import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import modalsReducer from './features/modalsSlice';
import dashboardReducer from './features/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    modals: modalsReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;