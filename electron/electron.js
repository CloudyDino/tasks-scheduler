const path = require("path");

const { app, BrowserWindow, Tray, Menu } = require("electron");
const isDev = require("electron-is-dev");
const process = require("process");

// Conditionally include the dev tools installer to load React Dev Tools
let window, tray, isQuiting, installExtension, REACT_DEVELOPER_TOOLS;

if (isDev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
  app.quit();
}

function createWindow() {
  window = new BrowserWindow({
    autoHideMenuBar: true,
    backgroundColor: "#171a1d",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  window.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/", getIcon())}`
  );

  // Open the DevTools.
  window.webContents.on("did-frame-finish-load", () => {
    if (isDev) {
      window.webContents.openDevTools({ mode: "bottom" });
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((error) => console.log(`An error occurred: , ${error}`));
    }
  });

  window.on("close", function (event) {
    if (!isQuiting) {
      event.preventDefault();
      window.hide();
      event.returnValue = false;
    }
  });
}

function createTray() {
  tray = new Tray(getIconPath());
  tray.setToolTip("Task Scheduler");
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Open",
        click: () => {
          window.show();
        },
      },
      {
        label: "Quit",
        click: () => {
          isQuiting = true;
          app.quit();
        },
      },
    ])
  );
}

function getIcon() {
  if (process.platform === "win32") {
    return "favicon.ico";
  }
  return "logo256.png";
}

function getIconPath() {
  return path.join(__dirname, "../build/", getIcon());
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
