# shell-fastmcp-server

A modern FastMCP server implementation that provides essential tools for data fetching, command execution, and content processing. Built with TypeScript and powered by the FastMCP framework.

## Features

- **Data Fetching**: Fetch and process web content with contextual prompts
- **Command Execution**: Execute shell commands safely in the workspace
- **Tool Integration**: Seamless integration with Ollama MCP clients
- **Modern Architecture**: Built with TypeScript and Cheerio for HTML processing

## Installation

```bash
npm install
```

## Usage

Start the server:
```bash
npx tsx src/index.ts
```
The server will be available at `http://localhost:14249/mcp`.

## Available Tools

### `fetchData`
Fetches data from a URL and processes it with an initial prompt.

**Parameters**:
- `url`: Valid URL to fetch (required)
- `initialPrompt`: Contextual prompt to include in the response

**Example**:
```json
{
  "name": "fetchData",
  "url": "https://example.com",
  "initialPrompt": "Summarize the main content of this page."
}
```

### `add`
Adds two numbers together.

**Parameters**:
- `a`: First number (required)
- `b`: Second number (required)

**Example**:
```json
{
  "name": "add",
  "a": 5,
  "b": 3
}
```

### `execute_command`
Executes shell commands in the workspace directory.

**Parameters**:
- `command`: Shell command to execute (required)
- `description`: Optional description of the command

**Example**:
```json
{
  "name": "execute_command",
  "command": "ls -l",
  "description": "List directory contents"
}
```

### `extractText`
Extracts all text content from HTML.

**Parameters**:
- `htmlContent`: HTML string to process (required)

**Example**:
```json
{
  "name": "extractText",
  "htmlContent": "<html><body>Hello World</body></html>"
}
```

## Configuration

The server is configured to run on `http://localhost:14249/mcp` with the following default settings:

```json
{
	{
	  "mcpServers": {
	   "shell-fastmcp-server": {
		"disable": false,
		"url": "http://localhost:14249/mcp",
		"type": "streamable_http"
	   }
	  }
	}
}
```

For some clients it is required to start the server beforehand and replace the command part with, for example "command": "echo" and '"args": [""]'.

## License

MIT