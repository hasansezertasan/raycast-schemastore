# JSON Schema Store

Search the [SchemaStore](https://www.schemastore.org) catalog for JSON schemas, right from Raycast.

## Usage

Open **Search Schema Store** and start typing. The list filters by schema name, description, and `fileMatch` patterns, so searching for `tsconfig.json` or `.eslintrc` finds the matching schema.

Each result offers these actions:

- **Copy Schema URL** (default): copy the schema's URL to the clipboard
- **Open in Browser**: open the schema in your browser
- **Paste in Active App**: paste the schema URL into the frontmost app
- **Show Details** / **Hide Details**: show the full description and every file pattern next to the list
- **Copy JSON Schema Line**: copy `"$schema": "<url>"`, ready to paste into a JSON file
- **Copy YAML Modeline**: copy `# yaml-language-server: $schema=<url>`, ready to paste at the top of a YAML file

The catalog is fetched from <https://www.schemastore.org/api/json/catalog.json> and cached between launches.
