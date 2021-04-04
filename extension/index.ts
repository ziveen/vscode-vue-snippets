import * as vscode from 'vscode'

const jsSnippets = require('../snippets/snippets.json');

type Snippets = {
  prefix: string,
  body: Array<string> | string,
  description: string
}

const convertSnippetArray2String = (snippetArray: string[]): string => snippetArray.join("\n")

export function activate(context: vscode.ExtensionContext) {
  console.log(`context`, context)

  const disposable = vscode.commands.registerCommand(
    'vue.extension.snippetSearch',
    async () => {
      const javascriptSnippets = Object.entries(jsSnippets as Array<Snippets>)

      const items = javascriptSnippets.map(
        ([shortDescription, { prefix, body, description}], index) => {
          return {
            id: index,
            description: description || shortDescription,
            label: prefix,
            value: prefix,
            body
          }
        }
      )

      const options = {
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolder: 'Search snippet',
      }
      const snippet = (await vscode.window.showQuickPick(items, options)) || {
        body: '',
      }

      const activeTextEditor = vscode.window.activeTextEditor
      const body =
        typeof snippet.body === 'string'
          ? snippet.body
          : convertSnippetArray2String(snippet.body)
        activeTextEditor?.insertSnippet(new vscode.SnippetString(body))

      console.log(`snippet`, snippet)
    }
  )

  context.subscriptions.push(disposable)
}

export function deactivate() {}