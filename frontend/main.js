const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs').promises;

let springBootProcess = null;
let mainWindow = null;



const basePath = app.isPackaged
  ? process.resourcesPath
  : path.join(__dirname, '..');

const pathToJar = app.isPackaged
  ? path.join(process.resourcesPath, 'backend', 'clinica', 'target', 'clinica-0.0.1-SNAPSHOT.jar')
  : path.join(__dirname, '..', 'backend', 'clinica', 'target', 'clinica-0.0.1-SNAPSHOT.jar');

const dbPath = app.isPackaged
  ? path.join(process.resourcesPath, 'db', 'clinica.db')
  : path.join(__dirname, '..', 'db', 'clinica.db');

const pendingDownloads = new Map(); 

let javaExecutablePath;

if (app.isPackaged) {
  if (process.platform === 'win32') {
    javaExecutablePath = path.join(process.resourcesPath, 'jre', 'bin', 'java.exe');
  } else if (process.platform === 'darwin') {
    javaExecutablePath = 'java';
  } else {
    javaExecutablePath = path.join(process.resourcesPath, 'jre', 'bin', 'java');
  }
} else {
  javaExecutablePath = 'java';
}

// Function to start Spring Boot backend
async function startSpringBoot() {
  console.log('Starting Spring Boot backend...');
  console.log('JAR path:', pathToJar);
  console.log('DB path:', dbPath);
  
  // Ensure the database directory exists
  const dbDir = path.dirname(dbPath);
  try {
    await fs.mkdir(dbDir, { recursive: true });
    console.log('Database directory ensured at:', dbDir);
  } catch (error) {
    console.error('Failed to create database directory:', error);
  }
  
  try {
    springBootProcess = spawn(javaExecutablePath, ['-jar', pathToJar], {
      env: {
        ...process.env,
        DB_PATH: dbPath,
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    springBootProcess.stdout.on('data', (data) => {
      console.log(`Spring Boot: ${data}`);
    });

    springBootProcess.stderr.on('data', (data) => {
      console.error(`Spring Boot error: ${data}`);
    });

    springBootProcess.on('error', (error) => {
      console.error('Failed to start Spring Boot process:', error);
    });

    springBootProcess.on('close', (code) => {
      console.log(`Spring Boot process exited with code ${code}`);
    });

    console.log('Spring Boot process started with PID:', springBootProcess.pid);
  } catch (error) {
    console.error('Error starting Spring Boot:', error);
  }
}

// Function to check if JAR file exists
async function checkJarExists() {
  try {
    await fs.access(pathToJar);
    console.log('JAR file found at:', pathToJar);
    return true;
  } catch (error) {
    console.error('JAR file not found at:', pathToJar);
    return false;
  }
}

// Function to check if database file exists
async function checkDbExists() {
  try {
    await fs.access(dbPath);
    console.log('DB file found at:', dbPath);
    return true;
  } catch (error) {
    console.error('DB file not found at:', dbPath);
    return false;
  }
}

ipcMain.handle('save-file', async(event, args)=>{
  const {type,filename, data} = args
  if(!data){
    return { success: false, error: 'No se proporcionaron datos de archivo.' };
  }
  try{
    const userDataPath = app.getPath('userData')
    let targetDir
    let targetFileName

    if(type==='logo'){
      targetDir = path.join(userDataPath, 'user_assets', 'logos')
      targetFileName = 'custom_logo.png'

    }
    else if(type === 'template'){
      targetDir = path.join(userDataPath, 'user_assets', 'templates')
      targetFileName = 'receta_template.docx'
    }
    else {
      return { success: false, error: 'Tipo de archivo no válido.' };
    }

    await fs.mkdir(targetDir, { recursive: true });

    // Construct the full file path
    const filePath = path.join(targetDir, targetFileName);

    // Convert ArrayBuffer to Node.js Buffer for writing
    const buffer = Buffer.from(data);

    // Write the file (fs.promises.writeFile overwrites by default if file exists)
    await fs.writeFile(filePath, buffer);

    return { success: true, filePath: filePath };
  }
  catch (error) {
        console.error(`Error saving ${type} file in main process:`, error);
        return { success: false, error: error.message || `Error desconocido al guardar el archivo ${type}.` };
    }
})

ipcMain.handle('get-custom-logo', async () =>{
  const userDataPath = app.getPath('userData')
  const customLogoPath = path.join(userDataPath, 'user_assets', 'logos', 'custom_logo.png')
  try {
        const fileBuffer = await fs.readFile(customLogoPath);
        // Determine content type based on file extension (or ensure it's always .png)
        const mimeType = 'image/png'; // Assuming you save as PNG
        // Convert Buffer to Data URL
        const dataUrl = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
        return { success: true, dataUrl: dataUrl };
    } catch (error) {
        // If file doesn't exist, or there's an error reading it, return failure
        if (error.code === 'ENOENT') { // ENOENT means "Error NO ENtry" (file not found)
            return { success: false, error: 'Custom logo not found.' };
        }
        console.error("Error reading custom logo in main process:", error);
        return { success: false, error: error.message || 'Failed to read custom logo.' };
      }
})

ipcMain.handle('get-docx-template', async () => { 
  const customTemplateFilename = 'receta_template.docx';
  const defaultTemplatePath = path.join(app.getAppPath(),'react-frontend' ,'public', 'docxReceta', 'template', 'templateTest.docx');

  const userDataPath = app.getPath('userData');
  const customTemplatePath = path.join(userDataPath, 'user_assets', 'templates', customTemplateFilename);

  try {
    const customFileBuffer = await fs.readFile(customTemplatePath);
    return { success: true, data: customFileBuffer };
  } catch (outerError) { 
    
    if (outerError.code === 'ENOENT') {
      try {
        const defaultFileBuffer = await fs.readFile(defaultTemplatePath);
        return { success: true, data: defaultFileBuffer };
      } catch (innerError) {
        console.error(`Error reading default template ${defaultTemplatePath}:`, innerError);
        return { success: false, error: `Default template not found or readable: ${innerError.message}` };
      }
    }
    console.error(`Error reading custom template ${customTemplatePath}:`, outerError);
    return { success: false, error: `Failed to read template: ${outerError.message}` };
  }
});

ipcMain.handle('initiate-silent-download', async (event, { arrayBuffer, filename, mimeType }) => {
    try {
        const webContents = event.sender; 

        pendingDownloads.set(webContents, filename); 
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');
        const dataUrl = `data:${mimeType};base64,${base64Data}`;

        webContents.downloadURL(dataUrl);

        return { success: true, message: `Download of '${filename}' initiated.` };

    } catch (error) {
        console.error("Error initiating silent download in main process:", error);
        return { success: false, error: error.message || "Unknown error initiating download." };
    }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'), 
      webSecurity: false
    },
  });

  mainWindow.loadFile(
    path.join(__dirname, 'react-frontend', 'build', 'index.html')
  );
}

app.whenReady().then(async () => {
  console.log('Electron app ready, checking JAR file...');
  
  const jarExists = await checkJarExists();
  const dbExists = await checkDbExists();
  
  if (!jarExists) {
    console.error('JAR file not found! Backend will not start.');
  } else if (!dbExists) {
    console.error('Database file not found! Backend may fail.');
  } else {
    // Start Spring Boot backend first
    await startSpringBoot();
    
    // Wait a moment for the backend to start before creating the window
    setTimeout(() => {
      createWindow();
    }, 2000); // Wait 2 seconds
  }

  session.defaultSession.on('will-download', (event, item, webContents) => {
      // Get the suggested filename
      const desiredFilename = pendingDownloads.get(webContents); 
      if (desiredFilename) {
          pendingDownloads.delete(webContents); 
      } else {
          console.warn("[main.js] No custom filename found for this download. Using item.getFilename().");
      }
      const filename = desiredFilename || item.getFilename(); 
      // Define a default download directory (e.g., user's Downloads folder)
      const downloadsPath = app.getPath('downloads');
      const fullSavePath = path.join(downloadsPath, filename);

      // Set the save path, preventing the "Save As" dialog
      item.setSavePath(fullSavePath);

      // Optional: Add download progress/completion logging
      item.on('updated', (event, state) => {
          if (state === 'interrupted') {
              console.log('Download is interrupted but can be resumed');
          } else if (state === 'progressing') {
              // console.log(`Downloading "${filename}" - ${item.getReceivedBytes()}/${item.getTotalBytes()}`);
          }
      });

      item.on('done', (event, state) => {
          if (state === 'completed') {
              console.log(`Download of "${filename}" completed successfully to: ${fullSavePath}`);
          } else {
              console.error(`Download of "${filename}" failed: ${state}`);
          }
      });
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  if (springBootProcess) {
    console.log('Killing Spring Boot process...');
    springBootProcess.kill();
  }
});

app.on('before-quit', () => {
  if (springBootProcess) {
    console.log('Terminating Spring Boot process before quit...');
    springBootProcess.kill('SIGTERM');
  }
});