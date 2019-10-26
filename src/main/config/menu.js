import { shell, Menu, ipcMain } from 'electron'

const setDefaultApplicationMenu = () => {
  if (Menu.getApplicationMenu()) return
  if (process.platform !== 'darwin') return

  const template = [
    {
      label: 'Workometer',
      submenu: [
        { label: 'About Application', selector: 'orderFrontStandardAboutPanel:' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        {
          label: 'Theme',
          submenu: [
            {
              id: 'theme-light',
              label: 'Light',
              type: 'radio',
              click (item, browserWindow) {
                browserWindow.webContents.send('theme-change', 'light')
              }
            },
            {
              id: 'theme-dark',
              label: 'Dark',
              type: 'radio',
              click (item, browserWindow) {
                browserWindow.webContents.send('theme-change', 'dark')
              }
            }
          ]
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click () {
            shell.openExternal(
              'https://github.com/SparingSoftware/workometer'
            )
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  ipcMain.on('theme-change', (_, theme) => {
    menu.getMenuItemById(`theme-${theme}`).checked = true
  })
}

export {
  setDefaultApplicationMenu
}
