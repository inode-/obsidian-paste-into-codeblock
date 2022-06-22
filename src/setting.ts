import PasteIntoCodeblock_Plugin from "main";
import { PluginSettingTab, Setting } from "obsidian";

export interface PluginSettings {
  language: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
  language: ""
};

export class PasteIntoCodeblockSettingsTab extends PluginSettingTab {
  display() {
    let { containerEl } = this;
    const plugin: PasteIntoCodeblock_Plugin = (this as any).plugin;

    containerEl.empty();
    containerEl.createEl("h2", { text: "Paste into codeblock Settings" });

    new Setting(containerEl)
      .setName("Default codeblock language")
      .setDesc(
        "Default language when pasting."
      )
      .addText((text) =>
        text
          .setPlaceholder("")
          .setValue(plugin.settings.language)
          .onChange(async (value) => {
            plugin.settings.language = value;
            await plugin.saveSettings();
          })
      );
  }
}
