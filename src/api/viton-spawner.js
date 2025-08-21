import { spawn } from 'child_process';
import path from 'path';

// Process tracking
const processes = {
  vitonFrontend: null,
  vitonBackend: null
};

function isProcessRunning(process) {
  return process && !process.killed && process.exitCode === null;
}

function spawnProcess(command, args, options, processName) {
  console.log(`Spawning ${processName}...`);
  console.log(`Command: ${command} ${args.join(' ')}`);
  console.log(`Working directory: ${options.cwd}`);
  
  const childProcess = spawn(command, args, {
    ...options,
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true
  });

  childProcess.stdout.on('data', (data) => {
    console.log(`[${processName}] ${data.toString()}`);
  });

  childProcess.stderr.on('data', (data) => {
    console.error(`[${processName}] ERROR: ${data.toString()}`);
  });

  childProcess.on('close', (code) => {
    console.log(`[${processName}] Process exited with code ${code}`);
    if (processName === 'VITON Frontend') {
      processes.vitonFrontend = null;
    } else if (processName === 'VITON Backend') {
      processes.vitonBackend = null;
    }
  });

  return childProcess;
}

export function startVitonFrontend(directory) {
  if (isProcessRunning(processes.vitonFrontend)) {
    return {
      success: true,
      message: 'VITON Frontend is already running',
      pid: processes.vitonFrontend.pid
    };
  }

  try {
    processes.vitonFrontend = spawnProcess('npm', ['run', 'dev'], {
      cwd: directory
    }, 'VITON Frontend');

    return {
      success: true,
      message: 'VITON Frontend started successfully',
      pid: processes.vitonFrontend.pid
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to start VITON Frontend',
      error: error.message
    };
  }
}

export function startVitonBackend(directory) {
  if (isProcessRunning(processes.vitonBackend)) {
    return {
      success: true,
      message: 'VITON Backend is already running',
      pid: processes.vitonBackend.pid
    };
  }

  try {
    // For Windows, use && for proper command chaining in cmd
    // This ensures uvicorn runs in the activated virtual environment
    processes.vitonBackend = spawnProcess('cmd', [
      '/c', 
      `cd /d "${directory}" && call venv\\Scripts\\activate.bat && uvicorn main:app`
    ], {
      cwd: directory
    }, 'VITON Backend');

    return {
      success: true,
      message: 'VITON Backend started successfully',
      pid: processes.vitonBackend.pid
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to start VITON Backend',
      error: error.message
    };
  }
}

export function getStatus() {
  return {
    frontend: {
      running: isProcessRunning(processes.vitonFrontend),
      pid: processes.vitonFrontend?.pid || null
    },
    backend: {
      running: isProcessRunning(processes.vitonBackend),
      pid: processes.vitonBackend?.pid || null
    }
  };
}

export function stopAll() {
  const stopped = [];
  
  if (isProcessRunning(processes.vitonFrontend)) {
    processes.vitonFrontend.kill();
    stopped.push('frontend');
  }
  
  if (isProcessRunning(processes.vitonBackend)) {
    processes.vitonBackend.kill();
    stopped.push('backend');
  }
  
  return {
    success: true,
    stopped: stopped
  };
}
