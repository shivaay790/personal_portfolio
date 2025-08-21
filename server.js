import express from 'express';
import { createServer as createViteServer } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Process tracking
const processes = {
  vitonFrontend: null,
  vitonBackend: null
};

// Helper function to check if process is running
function isProcessRunning(process) {
  return process && !process.killed && process.exitCode === null;
}

// Helper function to spawn process with logging
function spawnProcess(command, args, options, processName) {
  console.log(`🚀 Starting ${processName}...`);
  console.log(`Command: ${command} ${args.join(' ')}`);
  console.log(`Working directory: ${options.cwd}`);
  
  const childProcess = spawn(command, args, {
    ...options,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  childProcess.stdout.on('data', (data) => {
    console.log(`[${processName}] ${data.toString()}`);
  });

  childProcess.stderr.on('data', (data) => {
    console.error(`[${processName}] ERROR: ${data.toString()}`);
  });

  childProcess.on('close', (code) => {
    console.log(`[${processName}] Process exited with code ${code}`);
    // Clear the process reference when it exits
    if (processName === 'VITON Frontend') {
      processes.vitonFrontend = null;
    } else if (processName === 'VITON Backend') {
      processes.vitonBackend = null;
    }
  });

  childProcess.on('error', (error) => {
    console.error(`[${processName}] Failed to start: ${error.message}`);
  });

  return childProcess;
}

// VITON Frontend route
app.get('/viton/front', (req, res) => {
  console.log('🎯 /viton/front route accessed');
  
  const frontendPath = 'C:\\Users\\Shivaay Dhondiyal\\Desktop\\shivaay\\coding\\2_projects\\7_personal portfolio\\ezyZip\\frontend';
  
  // Check if process is already running
  if (isProcessRunning(processes.vitonFrontend)) {
    console.log('✅ VITON Frontend is already running');
    return res.json({
      status: 'success',
      message: 'VITON Frontend is already running on port 5173',
      url: 'http://localhost:5173',
      processId: processes.vitonFrontend.pid
    });
  }

  try {
    // Start VITON frontend
    processes.vitonFrontend = spawnProcess('npm', ['run', 'dev'], {
      cwd: frontendPath,
      shell: true
    }, 'VITON Frontend');

    console.log('✅ VITON Frontend started successfully');
    
    res.json({
      status: 'success',
      message: 'VITON Frontend started successfully',
      url: 'http://localhost:5173',
      processId: processes.vitonFrontend.pid,
      note: 'Frontend will be available at http://localhost:5173 once fully loaded'
    });

  } catch (error) {
    console.error('❌ Failed to start VITON Frontend:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to start VITON Frontend',
      error: error.message
    });
  }
});

// VITON Backend route
app.get('/viton/back', (req, res) => {
  console.log('🎯 /viton/back route accessed');
  
  const backendPath = 'C:\\Users\\Shivaay Dhondiyal\\Desktop\\shivaay\\coding\\2_projects\\7_personal portfolio\\ezyZip\\backend';
  
  // Check if process is already running
  if (isProcessRunning(processes.vitonBackend)) {
    console.log('✅ VITON Backend is already running');
    return res.json({
      status: 'success',
      message: 'VITON Backend is already running on port 8000',
      url: 'http://localhost:8000',
      processId: processes.vitonBackend.pid
    });
  }

  try {
    // First activate venv, then start uvicorn
    // On Windows, we need to activate the virtual environment first
    const activateCommand = path.join(backendPath, 'venv', 'Scripts', 'activate.bat');
    const uvicornCommand = 'uvicorn main:app --port 8000 --reload';
    
    // Combine commands for Windows
    const fullCommand = `"${activateCommand}" && ${uvicornCommand}`;
    
    processes.vitonBackend = spawnProcess('cmd', ['/c', fullCommand], {
      cwd: backendPath,
      shell: true
    }, 'VITON Backend');

    console.log('✅ VITON Backend started successfully');
    
    res.json({
      status: 'success',
      message: 'VITON Backend started successfully',
      url: 'http://localhost:8000',
      processId: processes.vitonBackend.pid,
      note: 'Backend API will be available at http://localhost:8000 once fully loaded'
    });

  } catch (error) {
    console.error('❌ Failed to start VITON Backend:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to start VITON Backend',
      error: error.message
    });
  }
});

// Status endpoint to check running processes
app.get('/viton/status', (req, res) => {
  const frontendRunning = isProcessRunning(processes.vitonFrontend);
  const backendRunning = isProcessRunning(processes.vitonBackend);
  
  console.log('📊 VITON Status Check:');
  console.log(`  Frontend: ${frontendRunning ? '✅ Running' : '❌ Not Running'}`);
  console.log(`  Backend: ${backendRunning ? '✅ Running' : '❌ Not Running'}`);
  
  res.json({
    frontend: {
      running: frontendRunning,
      pid: frontendRunning ? processes.vitonFrontend.pid : null,
      url: 'http://localhost:5173'
    },
    backend: {
      running: backendRunning,
      pid: backendRunning ? processes.vitonBackend.pid : null,
      url: 'http://localhost:8000'
    }
  });
});

// Kill processes endpoint (for cleanup)
app.post('/viton/stop', (req, res) => {
  console.log('🛑 Stopping VITON processes...');
  
  let stopped = [];
  
  if (isProcessRunning(processes.vitonFrontend)) {
    processes.vitonFrontend.kill();
    stopped.push('frontend');
    console.log('✅ VITON Frontend stopped');
  }
  
  if (isProcessRunning(processes.vitonBackend)) {
    processes.vitonBackend.kill();
    stopped.push('backend');
    console.log('✅ VITON Backend stopped');
  }
  
  if (stopped.length === 0) {
    console.log('ℹ️ No VITON processes were running');
  }
  
  res.json({
    status: 'success',
    message: `Stopped: ${stopped.join(', ') || 'no processes were running'}`,
    stopped: stopped
  });
});

async function createServer() {
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  
  // Use vite's connect instance as middleware
  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);

  // Start the server
  app.listen(PORT, () => {
    console.log(`🚀 Portfolio server running on http://localhost:${PORT}`);
    console.log(`📋 Available VITON routes:`);
    console.log(`  • http://localhost:${PORT}/viton/front - Start VITON Frontend`);
    console.log(`  • http://localhost:${PORT}/viton/back - Start VITON Backend`);
    console.log(`  • http://localhost:${PORT}/viton/status - Check process status`);
    console.log(`  • POST http://localhost:${PORT}/viton/stop - Stop all VITON processes`);
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, cleaning up...');
  if (processes.vitonFrontend) processes.vitonFrontend.kill();
  if (processes.vitonBackend) processes.vitonBackend.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, cleaning up...');
  if (processes.vitonFrontend) processes.vitonFrontend.kill();
  if (processes.vitonBackend) processes.vitonBackend.kill();
  process.exit(0);
});

createServer().catch(console.error);
