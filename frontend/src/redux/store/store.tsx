import { configureStore, isPlain } from '@reduxjs/toolkit';
import { baseApi } from '../feature/baseApi';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        isSerializable: (value: unknown) =>
          isPlain(value) ||
          value instanceof Blob ||
          value instanceof Request ||
          value instanceof Response,
      },
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
