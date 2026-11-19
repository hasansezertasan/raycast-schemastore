import { Action, ActionPanel, Icon, Keyboard, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState } from "react";

type CatalogEntry = {
  name: string;
  description?: string;
  url: string;
  fileMatch?: string[];
};

type Catalog = { schemas: CatalogEntry[] };

const CATALOG_URL = "https://www.schemastore.org/api/json/catalog.json";

const COPY_YAML_MODELINE_SHORTCUT: Keyboard.Shortcut = {
  macOS: { modifiers: ["cmd", "opt"], key: "c" },
  Windows: { modifiers: ["ctrl", "alt"], key: "c" },
};

function schemaDetailMarkdown(schema: CatalogEntry): string {
  return [`# ${schema.name}`, schema.description ?? "_No description._"].join("\n\n");
}

export default function Command() {
  const [isShowingDetail, setIsShowingDetail] = useState(false);
  const { data, isLoading, error } = useFetch<Catalog>(CATALOG_URL, {
    keepPreviousData: true,
  });

  return (
    <List
      isLoading={isLoading}
      isShowingDetail={isShowingDetail}
      searchBarPlaceholder="Filter schemas by name, description, or fileMatch…"
    >
      {!isLoading && (
        <List.EmptyView
          icon={error ? Icon.ExclamationMark : Icon.MagnifyingGlass}
          title={error ? "Couldn't Load Schemas" : "No Schemas Found"}
          description={
            error ? "Check your internet connection and try again." : "Try a different name or file pattern."
          }
        />
      )}
      {data?.schemas.map((schema) => (
        <List.Item
          key={`${schema.name}::${schema.url}`}
          icon={Icon.Code}
          title={schema.name}
          subtitle={isShowingDetail ? undefined : schema.description}
          keywords={[...(schema.fileMatch ?? []), ...(schema.description ? [schema.description] : [])]}
          accessories={isShowingDetail ? undefined : schema.fileMatch?.slice(0, 2).map((pattern) => ({ tag: pattern }))}
          detail={
            <List.Item.Detail
              markdown={schemaDetailMarkdown(schema)}
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Link title="Schema URL" text={schema.url} target={schema.url} />
                  {schema.fileMatch?.length ? (
                    <List.Item.Detail.Metadata.TagList title="File Patterns">
                      {schema.fileMatch.map((pattern) => (
                        <List.Item.Detail.Metadata.TagList.Item key={pattern} text={pattern} />
                      ))}
                    </List.Item.Detail.Metadata.TagList>
                  ) : (
                    <List.Item.Detail.Metadata.Label title="File Patterns" text="None" />
                  )}
                </List.Item.Detail.Metadata>
              }
            />
          }
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action.CopyToClipboard title="Copy Schema URL" content={schema.url} />
                <Action.OpenInBrowser url={schema.url} />
                <Action.Paste content={schema.url} />
                <Action
                  title={isShowingDetail ? "Hide Details" : "Show Details"}
                  icon={Icon.Sidebar}
                  shortcut={Keyboard.Shortcut.Common.ToggleQuickLook}
                  onAction={() => setIsShowingDetail((showing) => !showing)}
                />
              </ActionPanel.Section>
              <ActionPanel.Section>
                <Action.CopyToClipboard
                  title="Copy JSON Schema Line"
                  content={`"$schema": ${JSON.stringify(schema.url)}`}
                  shortcut={Keyboard.Shortcut.Common.Copy}
                />
                <Action.CopyToClipboard
                  title="Copy YAML Modeline"
                  content={`# yaml-language-server: $schema=${schema.url}`}
                  shortcut={COPY_YAML_MODELINE_SHORTCUT}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
