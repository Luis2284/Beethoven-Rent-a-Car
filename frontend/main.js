const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // Simplification for PoC; restrict in prod
        }
    });

    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
        // In Dev: Load from Angular Dev Server
        mainWindow.loadURL('http://localhost:4200');
        mainWindow.webContents.openDevTools();
    } else {
        // In Prod: Load built static files
        // Assuming Angular builds to dist/frontend/browser/index.html
        const indexPath = path.join(__dirname, 'dist', 'frontend', 'browser', 'index.html');
        mainWindow.loadFile(indexPath);
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

function startBackend() {
    const isDev = process.env.NODE_ENV === 'development';
    let backendPath;
    let backendCwd;

    if (isDev) {
        // Dev: Access the one we just published manually
        backendPath = path.join(__dirname, 'backend-dist', 'LosCarrosDeBeto.API.exe');
        backendCwd = path.join(__dirname, 'backend-dist');
    } else {
        // Prod: Access the one packed in resources
        // electron-builder packs 'extraResources' into 'resources' folder
        // process.resourcesPath points to that folder
        backendPath = path.join(process.resourcesPath, 'backend-dist', 'LosCarrosDeBeto.API.exe');
        backendCwd = path.join(process.resourcesPath, 'backend-dist');
    }

    const fs = require('fs');

    console.log('Starting Backend from:', backendPath);

    // Restore Logic
    const dbPath = path.join(backendCwd, 'app.db');
    const restorePath = path.join(backendCwd, 'app_restore.db');

    if (fs.existsSync(restorePath)) {
        console.log('Restoring database...');
        try {
            if (fs.existsSync(dbPath)) {
                const backupPath = path.join(backendCwd, `app_backup_${Date.now()}.db`);
                fs.renameSync(dbPath, backupPath);
                console.log(`Current DB backed up to: ${backupPath}`);
            }
            fs.renameSync(restorePath, dbPath);
            console.log('Database restored successfully.');
        } catch (err) {
            console.error('Error restoring database:', err);
        }
    }

    backendProcess = spawn(backendPath, ['--urls', 'http://localhost:5159'], {
        cwd: backendCwd
    });

    backendProcess.stdout.on('data', (data) => {
        console.log(`Backend: ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
        console.error(`Backend Error: ${data}`);
    });

    backendProcess.on('close', (code) => {
        console.log(`Backend process exited with code ${code}`);
    });
}

function killBackend() {
    if (backendProcess) {
        console.log('Killing backend process...');
        backendProcess.kill();
        backendProcess = null;
    }
}

app.on('ready', () => {
    startBackend();
    // Give backend a moment to start (naive approach) or wait-on in scripts
    setTimeout(createWindow, 2000);
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    killBackend();
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
