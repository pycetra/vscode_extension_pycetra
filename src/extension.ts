// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getWebviewContent } from './getWebviewContent';
import { runPythonScript } from './runPythonScript';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "pycetra_trial"!');

    // アクティブなテキストエディタがあるか確認し、.pygui.md ファイルであれば処理を実行
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && activeEditor.document.languageId === "pyguimd") {
        showWebview(activeEditor.document); // 既存のロジックを再利用
    }

    // ドキュメントが開かれたときのイベントリスナー
    let disposable = vscode.workspace.onDidOpenTextDocument(async (openedDocument) => {
        if (openedDocument.languageId === "pyguimd") {
            showWebview(openedDocument); // 既存のロジックを再利用
        }
    });

    context.subscriptions.push(disposable);
}
// 既存のロジックを再利用するための関数
async function showWebview(document: vscode.TextDocument) {
    vscode.window.showInformationMessage('Hello World from md2html!');

    // エディタで .pygui.md ファイルを表示
    const editor = await vscode.window.showTextDocument(document, vscode.ViewColumn.One);

    // Webview を作成して表示する
    const panel = vscode.window.createWebviewPanel(
        'markdownTextarea',
        'Markdown Textarea',
        vscode.ViewColumn.Beside, // エディタの隣に表示
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    // Set the webview's HTML content
    panel.webview.html = getWebviewContent(editor.document.getText(), editor.document.uri.fsPath);

	// Handle messages from the webview
	panel.webview.onDidReceiveMessage(
		async message => {
			switch (message.command) {
				case 'save':
					const text = message.text;
					const filePath = message.filePath;
					const writeData = Buffer.from(text, 'utf8');
					await vscode.workspace.fs.writeFile(vscode.Uri.file(filePath), writeData);

					// Pythonスクリプトを実行するように変更
					await runPythonScript("aaaa");
					break;
			}
		},
		undefined,
		// context.subscriptions
	);


}
// This method is called when your extension is deactivated
export function deactivate() { }
