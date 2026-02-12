import puppeteer from 'puppeteer';

async function fetchGitHubPage(url: string): Promise<string> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2' }); // Wait for the page to load
    const content = await page.content(); // Get the full HTML content
    return content;
  } catch (error) {
    console.error("Failed to fetch page:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Example usage
const url = "https://github.com/punkpeye/fastmcp/blob/main/README.md";
fetchGitHubPage(url)
  .then(html => {
    console.log("Page content:", html);
    // You can parse HTML with Cheerio or extract text as needed
  })
  .catch(err => {
    console.error("Error:", err.message);
  });