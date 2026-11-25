#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, path::PathBuf, process::Command, thread, time::Duration};

// The An Inspector Calls workspace. Each person's data is private to their own Claude account.
const URL_IC: &str = "https://claude.ai/artifact/Dq6idUVy5f5mZRYDLS4iuQ";

fn browsers() -> Vec<(PathBuf, &'static str)> {
    let mut out = Vec::new();
    let roots = ["ProgramFiles", "ProgramFiles(x86)", "LOCALAPPDATA"];
    for (sub, name) in [
        ("Google\\Chrome\\Application\\chrome.exe", "Chrome"),
        ("Microsoft\\Edge\\Application\\msedge.exe", "Edge"),
    ] {
        for root in roots {
            if let Ok(base) = env::var(root) {
                out.push((PathBuf::from(base).join(sub), name));
            }
        }
    }
    out
}

#[tauri::command]
fn open_workspace(app: tauri::AppHandle) -> String {
    let mut how = "your browser";
    let mut opened = false;
    for (exe, name) in browsers() {
        if exe.exists()
            && Command::new(&exe)
                .arg(format!("--app={URL_IC}"))
                .arg("--window-size=1440,920")
                .spawn()
                .is_ok()
        {
            how = name;
            opened = true;
            break;
        }
    }
    if !opened {
        let _ = Command::new("explorer.exe").arg(URL_IC).spawn();
    }
    thread::spawn(move || {
        thread::sleep(Duration::from_secs(4));
        app.exit(0);
    });
    how.to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_workspace])
        .run(tauri::generate_context!())
        .expect("error while running An Inspector Calls");
}
