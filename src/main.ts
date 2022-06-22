import { Editor, MarkdownView, Plugin } from "obsidian";
import PasteIntoCodeblock from "./core";
import {
  PluginSettings,
  PasteIntoCodeblockSettingsTab,
  DEFAULT_SETTINGS,
} from "setting";

export default class PasteIntoCodeblock_Plugin extends Plugin {
  settings: PluginSettings;

  async onload() {
    console.log("loading paste-into-codeblock");
    await this.loadSettings();

    this.addSettingTab(new PasteIntoCodeblockSettingsTab(this.app, this));
    this.addCommand({
      id: "paste-into-codeblock",
      name: "Paste into codeblock",
      hotkeys: [{ modifiers: ["Ctrl", "Alt"], key: "v" }],
      editorCallback: async (editor: Editor) => {
        const clipboardText = await navigator.clipboard.readText();
        PasteIntoCodeblock(editor, clipboardText, this.settings);
      },
    });

  }

  onunload() {
    console.log("unloading paste-into-codeblock");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
