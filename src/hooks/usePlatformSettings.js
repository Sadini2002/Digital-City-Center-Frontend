import { useCallback, useEffect, useState } from 'react'
import {
  getPlatformSettings,
  PLATFORM_SETTINGS_UPDATED_EVENT,
} from '../admin/utils/adminStorage'

export function usePlatformSettings() {
  const [settings, setSettings] = useState(() => getPlatformSettings())
  const [lastRefreshedAt, setLastRefreshedAt] = useState(() => new Date())

  const refresh = useCallback(() => {
    setSettings(getPlatformSettings())
    setLastRefreshedAt(new Date())
  }, [])

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === 'dcc_admin_platform_settings' || event.key === null) {
        refresh()
      }
    }
    const onSettingsUpdated = () => refresh()

    window.addEventListener('storage', onStorage)
    window.addEventListener(PLATFORM_SETTINGS_UPDATED_EVENT, onSettingsUpdated)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(PLATFORM_SETTINGS_UPDATED_EVENT, onSettingsUpdated)
    }
  }, [refresh])

  return { settings, refresh, lastRefreshedAt }
}
