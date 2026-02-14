import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import * as cheerio from 'cheerio';
import { exec } from 'child_process';

// Initialize FastMCP server
const server = new FastMCP({
  name: "Powershell server",
  version: "1.0.0",
  instructions: "The fetch data tool has a url and an initialPrompt paramter for you to use so that you dont forget your initial task or change your mind. you have following tools at your disposal: name: 'add', description: 'Add two numbers',   name: 'fetchData', description: 'Fetch data from a URL and process it with an initial prompt to not forget what the initial task was', 	name: 'execute_command', description: 'Execute a shell command in the workspace directory',",
});

// Define a tool (e.g., add two numbers)
server.addTool({
  name: "add",
  description: "Add two numbers",
  parameters: z.object({
    a: z.number(),
    b: z.number(),
  }),
  execute: async (args) => {
    return String(args.a + args.b);
  },
});

// Define a new tool for fetching data from an external URL
server.addTool({
  name: "fetchData",
  description: "Fetch data from a URL and process it with an initial prompt to not forget what the initial task was",
  parameters: z.object({
    url: z.string().url("Please provide a valid URL"),
    initialPrompt: z.string(),
  }),
  execute: async (args) => {
    try {
      const response = await fetch(args.url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.text();
      const $ = cheerio.load(data);
	  const afterScript = $('script').remove();
	  const afterStyle = $('style').remove();
      const bodyText = $('body').text();
      
      // Include initialPrompt in the output if provided
      const result = args.initialPrompt 
        ? `${bodyText}\n\n${args.initialPrompt}`
        : bodyText;
      
      return result;
    } catch (error) {
      console.error("Fetch error:", error);
      throw new Error("Failed to fetch data from the provided URL");
    }
  },
});
server.addTool({
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
});


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