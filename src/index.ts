import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import * as cheerio from 'cheerio';
import { exec } from 'child_process';
import is_ip_private from "private-ip";

// Initialize FastMCP server
const server = new FastMCP({
  name: "Powershell server",
  version: "1.0.0",
  instructions: "The fetch tool has an mandatory maxLength parmeter if none is given, try 30000. you have following tools at your disposal: name: 'add', description: 'Add two numbers',   name: 'fetch', description: 'Fetch text from an URL, with mandatory maxLength.', 	name: 'execute_command', description: 'Execute a shell command in the workspace directory',",
});

// Define a tool (e.g., add two numbers)
server.addTool({
  name: "add",
  description: "Add two numbers.",
  parameters: z.object({
    a: z.number(),
    b: z.number(),
  }),
  execute: async (args) => {
    return String(args.a + args.b);
  },
});

server.addTool({
  name: "fetch",
  description: "Fetch text from an URL, with mandatory maxLength.",
  parameters: z.object({
    url: z.string().url("Please provide a valid URL"),
    maxLength: z.number(),
  }),
  execute: async (args) => {
    try {
      if (is_ip_private(args.url)) {
        throw new Error(
          `Fetcher blocked an attempt to fetch a private IP ${args.url}. This is to prevent a security vulnerability where a local MCP could fetch privileged local IPs and exfiltrate data.`,
        );
      }
      const response = await fetch(args.url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.text();
      const $ = cheerio.load(data);
      const afterScript = $('script').remove();
      const afterStyle = $('style').remove();
      let bodyText = $('body').text().replace(/\s+/g, " ").trim();

      // Apply maxLength if provided
      if (args.maxLength) {
        bodyText = bodyText.substring(0, args.maxLength);
      }

      return bodyText;
    } catch (error) {
      console.error("Fetch error:", error);
      throw new Error("Failed to fetch data from the provided URL");
    }
  },
});
/*server.addTool({
	name: "execute_command",
	description: "Execute a shell command in the workspace directory",
	parameters: z.object({
	 command: z.string(),
	 description: z.string().optional(),
	}),
	execute: async (args) => {
	 const { command } = args;
	 return new Promise((resolve, reject) => {
	  exec(command, (error, stdout, stderr) => {
	  if (error) {
	    reject(error);
	   } else {
	    resolve(stdout + stderr);
	   }
	  });
	 });
	}
});*/


// Define a tool for extracting text from HTML content
server.addTool({
  name: "extractText",
  description: "Extract text from HTML content",
  parameters: z.object({
    htmlContent: z.string(),
  }),
  execute: async (args) => {
    const $ = cheerio.load(args.htmlContent);
    return $('body').text(); // Extract all text
  },
});
server.on("connect", (event) => {
  console.log("Client connected:", event.session);
});

server.on("disconnect", (event) => {
  console.log("Client disconnected:", event.session);
});
server.start({
  transportType: "httpStream",
  httpStream: {
    port: 14249,
	host: "127.0.0.1"
  },
});