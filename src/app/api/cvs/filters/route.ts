import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GENDERS } from "@/lib/constants";

export const runtime = "nodejs";

// Read from the database on every request (see /api/domains for why).
export const dynamic = "force-dynamic";

// Admin only: middleware protects everything under /api/cvs.
// Returns the values that actually exist on file, so the filters never offer
// an option that would return nobody.

/** Distinct values, ignoring case and blanks, keeping the first spelling seen. */
function distinct(values: (string | null)[]): string[] {
  const seen = new Map<string, string>();
  for (const v of values) {
    const value = v?.trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (!seen.has(key)) seen.set(key, value);
  }
  return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
}

export async function GET() {
  try {
    const [professions, industries, degrees, locations, genders] = await Promise.all([
      prisma.cV.findMany({ distinct: ["domain"], select: { domain: true } }),
      prisma.cV.findMany({ distinct: ["industry"], select: { industry: true } }),
      prisma.cV.findMany({ distinct: ["degree"], select: { degree: true } }),
      prisma.cV.findMany({ distinct: ["city"], select: { city: true } }),
      prisma.cV.findMany({ distinct: ["gender"], select: { gender: true } }),
    ]);

    const genderOrder = (g: string) => {
      const i = (GENDERS as readonly string[]).indexOf(g);
      return i === -1 ? GENDERS.length : i;
    };

    return NextResponse.json({
      professions: distinct(professions.map((r) => r.domain)),
      industries: distinct(industries.map((r) => r.industry)),
      degrees: distinct(degrees.map((r) => r.degree)),
      locations: distinct(locations.map((r) => r.city)),
      genders: distinct(genders.map((r) => r.gender)).sort(
        (a, b) => genderOrder(a) - genderOrder(b)
      ),
    });
  } catch (err) {
    console.error("Failed to load filter options", err);
    return NextResponse.json({
      professions: [],
      industries: [],
      degrees: [],
      locations: [],
      genders: [],
    });
  }
}
