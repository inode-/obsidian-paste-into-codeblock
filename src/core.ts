import assertNever from "assert-never";
import { PluginSettings } from "setting";
import { Editor, EditorPosition, EditorRange } from "obsidian";

/**
 * @param editor Obsidian Editor Instance
 * @param cbString text on clipboard
 * @param settings plugin settings
 */
export default function PasteIntoCodeblock(editor: Editor, cbString: string, settings: PluginSettings): void;
/**
 * @param editor Obsidian Editor Instance
 * @param cbEvent clipboard event
 * @param settings plugin settings
 */
export default function PasteIntoCodeblock(editor: Editor, cbEvent: ClipboardEvent, settings: PluginSettings): void;
export default function PasteIntoCodeblock(editor: Editor, cb: string | ClipboardEvent, settings: PluginSettings): void {

  if (typeof cb !== "string" && cb.clipboardData === null) {
    console.error("empty clipboardData in ClipboardEvent");
    return;
  }

  const clipboardText = getCbText(cb);
  
  if (clipboardText === null) return;

  const clipboardTextCodeblock = '\n``` ' + settings.language + '\n' + clipboardText + '\n```\n';

  const { selectedText, replaceRange } = getSelnRange(editor, settings);

  // apply changes
  if (typeof cb !== "string") cb.preventDefault(); // prevent default paste behavior
  replace(editor, clipboardTextCodeblock, replaceRange);

  // if nothing is selected and the nothing selected position the curson at the end of the paste
  if ((selectedText === "") ) {
    editor.setCursor({ ch: replaceRange.from.ch, line: replaceRange.from.line +  clipboardTextCodeblock.split(/\r\n|\r|\n/).length - 1 });
  }
}

function getSelnRange(editor: Editor, settings: PluginSettings) {
  let selectedText: string;
  let replaceRange: EditorRange | null;

  if (editor.somethingSelected()) {
    selectedText = editor.getSelection().trim();
    replaceRange = null;
  } else {
    replaceRange = getCursor(editor);
    selectedText = "";
  }
  return { selectedText, replaceRange };
}

function getCbText(cb: string | ClipboardEvent): string | null {
  let clipboardText: string;

  if (typeof cb === "string") {
    clipboardText = cb;
  } else {
    if (cb.clipboardData === null) {
      console.error("empty clipboardData in ClipboardEvent");
      return null;
    } else {
      clipboardText = cb.clipboardData.getData("text");
    }
  }
  return clipboardText.trim();
}

function getCursor(editor: Editor): EditorRange {
  return { from: editor.getCursor(), to: editor.getCursor() };
}

function replace(editor: Editor, replaceText: string, replaceRange: EditorRange | null = null): void {

  // replaceRange is only not null when there isn't anything selected.
  if (replaceRange && replaceRange.from && replaceRange.to) {
    editor.replaceRange(replaceText, replaceRange.from, replaceRange.to);
  }
  // if word is null or undefined
  else editor.replaceSelection(replaceText);
}
