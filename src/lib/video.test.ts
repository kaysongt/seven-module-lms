import { describe, expect, it } from "vitest";
import { getVideoEmbedUrl } from "@/lib/video";

describe("video embeds", () => {
  it("converts supported YouTube links to privacy-enhanced embeds", () => {
    expect(getVideoEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
    expect(getVideoEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
  });

  it("converts Vimeo links and rejects unsupported hosts", () => {
    expect(getVideoEmbedUrl("https://vimeo.com/12345678")).toBe(
      "https://player.vimeo.com/video/12345678",
    );
    expect(getVideoEmbedUrl("https://youtube.com.example.org/watch?v=unsafe")).toBeNull();
    expect(getVideoEmbedUrl("not-a-url")).toBeNull();
  });
});
