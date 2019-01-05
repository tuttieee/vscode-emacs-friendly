import * as assert from 'assert';
import * as vscode from 'vscode';
import {Selection, Position} from 'vscode';

import {Editor} from '../src/editor';

suite('Editor.getSelectionsText()', () => {
    test('it sorts ranges and aggregates the selected texts in order', async () => {
        const content = `0123456789
abcdefghij
ABCDEFGHIJ`;
        const editor = new Editor();

        const doc = await vscode.workspace.openTextDocument({
            content,
            language: 'text',
        });
        await vscode.window.showTextDocument(doc);

        // Select with multi cursor in not aligned order
        vscode.window.activeTextEditor.selections = [
            new Selection(new Position(1, 0), new Position(1, 3)),
            new Selection(new Position(0, 0), new Position(0, 3)),
            new Selection(new Position(2, 0), new Position(2, 3)),
        ];

        await editor.cut();

        assert.equal(
            doc.getText(),
            `3456789
defghij
DEFGHIJ`
        );

        // Open a empty document
        const yankDoc = await vscode.workspace.openTextDocument({
            content: '',
            language: 'text',
        });
        await vscode.window.showTextDocument(yankDoc);
        vscode.window.activeTextEditor.selections = [
            new Selection(new Position(0, 0), new Position(0, 0)),
        ];

        await editor.yank();

        assert.equal(
            yankDoc.getText(),
            `012
abc
ABC`
        );
    });
});
