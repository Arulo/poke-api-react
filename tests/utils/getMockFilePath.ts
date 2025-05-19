import path from "path";

export const getMockFilePath = (url: string): string | null => {
  const parsed = new URL(url);
  const { pathname, searchParams } = parsed;

  if (pathname.startsWith("/api/v2/pokemon")) {
    if (searchParams.has("offset")) {
      const offset = searchParams.get("offset");
      return path.join(__dirname, `../../mock-api/list_offset_${offset}.json`);
    }

    const idOrName = pathname.split("/").filter(Boolean).pop();
    return path.join(__dirname, `../../mock-api/pokemon/${idOrName}.json`);
  }

  if (pathname.startsWith("/api/v2/type")) {
    const type = pathname.split("/").filter(Boolean).pop();
    return path.join(__dirname, `../../mock-api/type/${type}.json`);
  }

  return null;
};
