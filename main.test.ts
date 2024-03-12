
import { expect, test } from '@playwright/test'
import { findLatestBuild, parseElectronApp } from 'electron-playwright-helpers'
import { ElectronApplication, _electron as electron } from 'playwright'

let electronApp: ElectronApplication

test.beforeAll(async () => {
  const latestBuild = findLatestBuild()
  const appInfo = parseElectronApp(latestBuild)
  process.env.CI = 'e2e'
  electronApp = await electron.launch({
    args: [appInfo.main],
    executablePath: appInfo.executable
  })
})

test.afterAll(async () => {
  await electronApp.close()
})

test('ElectronApplication.evaluate matches type at runtime', async () => {
  type CrossProcessExportKey = keyof typeof Electron.CrossProcessExports
  const actual = await electronApp.evaluate(electron => Object.keys(electron).sort())
  const expected: CrossProcessExportKey[] = [
    'BrowserView',
    'BrowserWindow',
    'Menu',
    'MenuItem',
    'MessageChannelMain',
    'Notification',
    'ShareMenu',
    'TouchBar',
    'Tray',
    'app',
    'autoUpdater',
    'clipboard',
    'contentTracing',
    'contextBridge',
    'crashReporter',
    'desktopCapturer',
    'dialog',
    'globalShortcut',
    'inAppPurchase',
    'ipcMain',
    'ipcRenderer',
    'nativeImage',
    'nativeTheme',
    'net',
    'netLog',
    'powerMonitor',
    'powerSaveBlocker',
    'protocol',
    'pushNotifications',
    'safeStorage',
    'screen',
    'session',
    'shell',
    'systemPreferences',
    'utilityProcess',
    'webContents',
    'webFrame',
    'webFrameMain',
    'webUtils'
  ]

  expect(actual).toEqual(expected)
})
