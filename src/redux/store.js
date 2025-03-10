import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import { authReducer } from "./auth/authSlice";
import { instructorsReducer } from "./instructors/instructorsSlice";
import { eventsReducer } from "./events/eventsSlice";
import { facilitiesReducer } from "./facilities/facilitiesSlice";
import { searchReducer } from "./search/searchSlice";
import { rateReducer } from "./rate/rateSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token"],
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    instructors: instructorsReducer,
    events: eventsReducer,
    facilities: facilitiesReducer,
    search: searchReducer,
    rate: rateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
