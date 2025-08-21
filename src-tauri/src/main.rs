// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use tauri::{AppHandle, Manager, Window};

#[tauri::command]
async fn execute_command(command: String, detached: bool) -> Result<String, String> {
    println!("Executing command: {}", command);
    
    if detached {
        // For detached processes (like starting servers)
        #[cfg(target_os = "windows")]
        {
            let mut cmd = Command::new("cmd");
            cmd.args(&["/C", &command]);
            
            match cmd.spawn() {
                Ok(_) => Ok("Command started successfully".to_string()),
                Err(e) => Err(format!("Failed to start command: {}", e)),
            }
        }
        
        #[cfg(not(target_os = "windows"))]
        {
            let mut cmd = Command::new("sh");
            cmd.args(&["-c", &command]);
            
            match cmd.spawn() {
                Ok(_) => Ok("Command started successfully".to_string()),
                Err(e) => Err(format!("Failed to start command: {}", e)),
            }
        }
    } else {
        // For commands that need to complete
        #[cfg(target_os = "windows")]
        {
            let output = Command::new("cmd")
                .args(&["/C", &command])
                .output()
                .map_err(|e| format!("Failed to execute command: {}", e))?;
            
            Ok(String::from_utf8_lossy(&output.stdout).to_string())
        }
        
        #[cfg(not(target_os = "windows"))]
        {
            let output = Command::new("sh")
                .args(&["-c", &command])
                .output()
                .map_err(|e| format!("Failed to execute command: {}", e))?;
            
            Ok(String::from_utf8_lossy(&output.stdout).to_string())
        }
    }
}

#[tauri::command]
async fn minimize_window(window: Window) -> Result<(), String> {
    window.minimize().map_err(|e| format!("Failed to minimize window: {}", e))
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![execute_command, minimize_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
