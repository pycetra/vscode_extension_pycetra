// Helper function to escape HTML characters
function escapeHtml(unsafeText: string): string {
    return unsafeText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


export function getWebviewContent(markdownText: string, filePath: string): string {
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

				window.addEventListener('message', event => {
					// iframe からのメッセージを受け取る
					if (event.origin === 'https://pycetra.com') { // 信頼できるオリジンからのメッセージのみを処理
						// VS Code の拡張機能にメッセージを送信
						vscode.postMessage({
							command: 'fromIframe',
							data: event.data
						});
					}
				});
			</script>
		</head>
		<body>
			<textarea id="markdownTextarea" style="width:100%; height:90%;">${escapeHtml(markdownText)}</textarea>
			<button style="width:100%; height:10%;" onclick="saveMarkdown()">xxx</button>
			<iframe src="https://pycetra.com/raw/" style="width:100%; height:10%;"></iframe>
		</body>
		</html>
	`;
}