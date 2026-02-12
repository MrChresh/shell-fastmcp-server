"shell-fastmcp-server": {
			"command": "npx",
			"args": ["tsx", "shell-fastmcp-server/src/index.ts"],
			"disable": true,
			"baseUrl": "http://localhost:14249/mcp",
			"type": "http",
			"autoApprove": [
				"write",
				"read"
			]
		}