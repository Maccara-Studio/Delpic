import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { mmkvStorage } from "./mmkvStorage";
import { createSessionSlice } from "./slices/sessionSlice";
import { createSettingsSlice } from "./slices/settingsSlice";
import type { AppState } from "./types";

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createSessionSlice(...a),
      ...createSettingsSlice(...a),
    }),
    {
      name: "delpic-store",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
