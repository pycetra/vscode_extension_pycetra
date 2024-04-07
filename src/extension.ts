// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from 'path';
import * as vscode from 'vscode';
import { getWebviewContent } from './getWebviewContent';
import { main } from './md2graph';

export function activate(context: vscode.ExtensionContext) {
    // console.log('Congratulations, your extension "md2html" is now activeaaaa!');
    // ドキュメントが開かれたときのイベントリスナー
    let disposable = vscode.workspace.onDidOpenTextDocument(async (openedDocument) => {
        if (openedDocument.languageId === "pyguimd") {
            showWebview(openedDocument, context); // 既存のロジックを再利用
        }
    });

    context.subscriptions.push(disposable);
}
// 既存のロジックを再利用するための関数
async function showWebview(document: vscode.TextDocument, context: vscode.ExtensionContext,) {
    vscode.window.showInformationMessage('Hello World from md2html!');

    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder found.');
        return;
    }

    const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const filePath = path.join(folderPath, 'sample003.md');

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


    panel.webview.html = getWebviewContent(context, panel.webview, editor.document.uri.fsPath);

    // initialization
    const text = main(editor.document.getText());
    panel.webview.onDidReceiveMessage(
        // webviewが読み込み終わったときに、webview->vscodeへpostmessageが送られる
        async message => {
            console.log(message);
            if (message.command === 'init_message') {
                panel.webview.postMessage({
                    command: 'vscode->webview',
                    message: text
                });
            } else if (message.command === 'vscode<-webview') {
                const textBytes = Buffer.from(message.message, 'utf8');
                try {
                    await vscode.workspace.fs.writeFile(vscode.Uri.file(filePath), textBytes);
                    vscode.window.showInformationMessage('File saved successfully!');
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        vscode.window.showErrorMessage('Failed to save the file: ' + error.message);
                    } else {
                        vscode.window.showErrorMessage('Failed to save the file for an unknown reason.');
                    }
                }
            }
        },
        undefined, // 全てのメッセージを受信
        context.subscriptions //拡張機能が非アクティブになったときにリソースを解放する
    );


    const aaa = JSON.stringify({ "node_feature": { "id": [1001, 1002, 1003, 1004, 1005], "text": ["aaa", "node1002", "node1003", "node1004", "node1005"], "level": [0, 0, 1, 2, 3], "sortkey": [0, 1, 0, 0, 0], "x": [0.0, 0.0, 0.0, 0.0, 0.0], "y": [0.0, 0.0, 0.0, 0.0, 0.0], "selecter": [0, 0, 0, 0, 0], "region": ["", "", "", "", ""], "stylecls": [["", ""], ["", ""], ["", ""], ["", ""], ["", ""]], "position": [[0], [0], [0], [0], [0]] }, "link_feature": { "id": [2000, 2001, 2002], "from": [1002, 1003, 1004], "to": [1003, 1004, 1005], "x_from": [0.0, 0.0, 0.0], "y_from": [0.0, 0.0, 0.0], "x_to": [0.0, 0.0, 0.0], "y_to": [0.0, 0.0, 0.0], "selecter": [0, 0, 0], "region": ["", "", ""], "stylecls": [[""], [""], [""]] } });
    // 	// var iframe = panel.webview.html.querySelector('iframe').contentWindow;
    // 	panel.webview.postMessage({message:aaa},'*',);
    // }, 3000);

    // panel.webview.postMessage({ message: dataframe_str });


    // let currentPanel: vscode.WebviewPanel | undefined = undefined;
    // // テキストドキュメントの変更を監視する
    // vscode.workspace.onDidChangeTextDocument((event) => {
    //     if (currentPanel && event.document === vscode.window.activeTextEditor?.document) {
    //         // 変更されたドキュメントが選択中のファイルであるか確認
    //         if (event.document.fileName.endsWith('pygui.md')) {
    //             // WebViewにメッセージを送信
    //             currentPanel.webview.postMessage({
    //                 command: 'sendData',
    //                 data: aaa
    //             });
    //         }
    //     }
    // });

}
// This method is called when your extension is deactivated
export function deactivate() { }
