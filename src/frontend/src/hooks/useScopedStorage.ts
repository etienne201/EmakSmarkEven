"use client";

import { useLocalStorage } from "./useLocalStorage";
import { useEffect, useState } from "react";

/**
 * A specialized hook that scopes localStorage keys by ownerId.
 * This prevents data leaks between different events/users on the same browser.
 */
export function useScopedStorage<T>(key: string, initialValue: T, ownerId: string = "default") {
  const scopedKey = `${ownerId}_${key}`;
  const [value, setValue] = useLocalStorage<T>(scopedKey, initialValue);

  return [value, setValue] as const;
}
