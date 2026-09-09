import { describe, it, expect, afterEach } from "vitest";
import { cloudinaryLoader } from "./loader";

const ORIGINAL = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
afterEach(() => { process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD = ORIGINAL; });

describe("cloudinaryLoader", () => {
  it("sin cloud configurado, passthrough del src", () => {
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
    expect(cloudinaryLoader({ src: "https://images.unsplash.com/x.jpg", width: 800 }))
      .toBe("https://images.unsplash.com/x.jpg");
  });
  it("con cloud configurado, arma URL de transformacion con width y quality", () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD = "meridian";
    const url = cloudinaryLoader({ src: "/hero.jpg", width: 1200, quality: 70 });
    expect(url).toContain("res.cloudinary.com/meridian");
    expect(url).toContain("w_1200");
    expect(url).toContain("q_70");
  });
});
