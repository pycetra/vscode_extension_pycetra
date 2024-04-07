// Helper function to escape HTML characters
function escapeHtml(unsafeText: string): string {
	return unsafeText
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

import * as vscode from 'vscode';
export function getWebviewContent(context: vscode.ExtensionContext, webview: vscode.Webview, filePath: string): string {
	// ローカルのリソースへのパスをWebviewで使用できるURIに変換	// ローカルのリソースへのパスをWebviewで使用できるURIに変換
	const scriptUri = vscode.Uri.parse('https://pycetra.com/raw/index-_kdI4am5.js');
	const styleUri = vscode.Uri.parse('https://pycetra.com/raw/index-gR7Bp3cm.css');
	const markdownText = "aaa";

	// Webviewで使用できるURIに変換
	const scriptSrc = webview.asWebviewUri(scriptUri);
	const styleHref = webview.asWebviewUri(styleUri);

	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Markdown Preview</title>
			<script>
				const vscode = acquireVsCodeApi();
				function saveMarkdown() {
					const text = document.getElementById('markdownTextarea').value;
					vscode.postMessage({
						command: 'save',
						text: text,
						filePath: '${filePath}'
					});
				}

				// vscode <-[init]- webview <-[init]- iframe
				document.addEventListener('DOMContentLoaded', (event) => {
					console.log("vscode <-[init]- webview <-[init]- iframe");
					vscode.postMessage({
						command: 'init_message',
					});
				});

				window.addEventListener('message', event => {
					if(event.data.command === 'vscode->webview'){
						// vscode -[update]-> webview -[update]-> iframe
						console.log("vscode -[update]-> webview -[update]-> iframe");
						console.log(event);
						const iframe = document.querySelector('iframe');
						iframe.contentWindow.postMessage({ message: event.data.message }, '*');
					}else if(event.origin === 'https://pycetra.com'){
						// vscode <-[update]- webview <-[update]- iframe
						console.log("vscode <-[update]- webview <-[update]- iframe");
						vscode.postMessage({
							command: 'vscode<-webview',
							message: event.data.message
						});
					}else{
						console.log("other",event)
					}
				});
			</script>
		</head>
		<body>
			<textarea id="markdownTextarea" style="width:100%; height:20%;">${escapeHtml(markdownText)}</textarea>
			<button style="width:100%; height:10%;" onclick="saveMarkdown()">xxx</button>
			<iframe src="https://pycetra.com/raw/" style="width:100%; height:auto;min-height:500px;"></iframe>
		</body>
		</html>
	`;
}