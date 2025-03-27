import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "सारंग's Notes",
    titleImage: "",
    enableSPA: true,
    enablePopovers: true,
    locale: "en-US",
    baseUrl: "notes.sarangwandile.xyz",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "JetBrains Mono Bold",
        body: "JetBrains Mono Light",
        code: "JetBrains Mono Regular",
      },
      defaultMode: 'dark',
      colors: {
        lightMode: {
          light: "#1a1b26",
          lightgray: "#33384b",
          gray: "#c0caf5",
          darkgray: "#c0caf5",
          dark: "#61bdc9",
          secondary: "#b091e8",
          tertiary: "#ae63dd",
          highlight: "rgba(110, 87, 152, 0.15)",
          textHighlight: "rgba(75, 109, 137, 0.15)",
        },
        darkMode: {
          light: "#1a1b26",
          lightgray: "#33384b",
          gray: "#c0caf5",
          darkgray: "#c0caf5",
          dark: "#61bdc9",
          secondary: "#b091e8",
          tertiary: "#ae63dd",
          highlight: "rgba(110, 87, 152, 0.15)",
          textHighlight: "rgba(75, 109, 137, 0.15)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
