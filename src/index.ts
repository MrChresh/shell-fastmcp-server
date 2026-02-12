import { FastMCP } from "fastmcp";
import { z } from "zod";
import * as cheerio from 'cheerio';

// Initialize FastMCP server
const server = new FastMCP({
  name: "Powershell server",
  version: "1.0.0",
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
  description: "Fetch data from an external URL",
  parameters: z.object({
    url: z.string().url("Please provide a valid URL"),
  }),
  execute: async (args) => {
    try {
      const response = await fetch(args.url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.text();
      /*return data;*/
	  const $ = cheerio.load(data);
	  return $('body').text();
    } catch (error) {
      console.error("Fetch error:", error);
      throw new Error("Failed to fetch data from the provided URL");
    }
  },
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

server.start({
  transportType: "httpStream",
  httpStream: {
    port: 14249,
  },
});