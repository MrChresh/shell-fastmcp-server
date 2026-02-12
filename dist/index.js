import { FastMCP } from "fastmcp";
import { z } from "zod";
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
// Add a custom HTTP route (e.g., a simple API endpoint)
/*server.addRoute("GET", "/api/sum", async (req, res) => {
  const a = parseFloat(req.query.a as string);
  const b = parseFloat(req.query.b as string);
  if (isNaN(a) || isNaN(b)) {
    res.status(400).send("Invalid numbers");
    return;
  }
  res.json({ result: a + b });
});*/
// Start the server
server.start({
    transportType: "stdio", // Or "httpStream" for HTTP streaming
});
server.start({
    transportType: "httpStream",
    httpStream: {
        port: 8080,
    },
});
