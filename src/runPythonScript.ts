import * as vscode from 'vscode';

// Pythonスクリプトを実行する関数
export async function runPythonScript(content: string): Promise<void> {
	const pythonScript = `print(${JSON.stringify(content)})`;
	const terminalName = 'Python Runner';
	let terminal = vscode.window.terminals.find(t => t.name === terminalName);
	if (!terminal) {
		terminal = vscode.window.createTerminal({ name: terminalName });
	}
	terminal.show();
	terminal.sendText(`python -c "${pythonScript.replace(/"/g, '\\"')}"`);
}
