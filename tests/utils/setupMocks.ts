import fs from "fs";
import { getMockFilePath } from "./getMockFilePath";
import { Page } from "@playwright/test";

export async function setupApiMocks(page: Page) {
  // Intercepts all actual API calls
  await page.route("**/api/v2/**", async (route) => {
    const url = route.request().url();
    const filePath = getMockFilePath(url);

    // This will print the files requested, important when interacting with pagination buttons
    // console.log("This is the filePath:", filePath);

    if (filePath && fs.existsSync(filePath)) {
      // Read mock JSON file from disc
      const body = fs.readFileSync(filePath, "utf8");
      // Respond with the previously stored JSON response
      route.fulfill({ body, contentType: "application/json" });
    } else {
      console.warn(`⚠️ No mock data for: ${url}`);
      route.abort();
    }
  });
}
