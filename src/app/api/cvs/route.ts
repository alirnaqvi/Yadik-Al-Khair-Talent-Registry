import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { cvFormSchema } from "@/lib/validation";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/constants";

export const runtime = "nodejs";

// Short, non-sensitive hint about what failed, so a failed submission can be
// diagnosed from the browser. Prisma errors expose a code such as P2021
// (table missing) or P1001 (database unreachable).
function errorHint(err: unknown): string {
  const e = err as { code?: string; errorCode?: string };
  const code = e?.code ?? e?.errorCode;
  return code ? ` (${code})` : "";
}

// ---------- POST /api/cvs -- public CV submission ----------
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const raw = {
      fullName: formData.get("fullName")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      phone: formData.get("phone")?.toString() ?? "",
      domain: formData.get("domain")?.toString() ?? "",
      industry: formData.get("industry")?.toString() ?? "",
      degree: formData.get("degree")?.toString() ?? "",
      gender: formData.get("gender")?.toString() ?? "",
      age: formData.get("age")?.toString() ?? "",
      pwd: formData.get("pwd")?.toString() ?? "",
      experienceYears: formData.get("experienceYears")?.toString() ?? "",
      currentRole: formData.get("currentRole")?.toString() ?? "",
      currentCompany: formData.get("currentCompany")?.toString() ?? "",
      education: formData.get("education")?.toString() ?? "",
      skills: formData.get("skills")?.toString() ?? "",
      city: formData.get("city")?.toString() ?? "",
    };

    const parsed = cvFormSchema.safeParse(raw);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid form data" },
        { status: 400 }
      );
    }

    const file = formData.get("cv");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Attach your CV as a PDF or Word document" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File is too large. Maximum size is 8 MB" },
        { status: 400 }
      );
    }

    if (file.type && !ACCEPTED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF, DOC, or DOCX files are accepted" },
        { status: 400 }
      );
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error:
            "File storage is not configured yet. Set BLOB_READ_WRITE_TOKEN in the environment.",
        },
        { status: 500 }
      );
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_ ]/g, "").slice(-100);
    const blobPath = `cvs/${Date.now()}-${safeName || "cv.pdf"}`;

    // CVs contain personal details, so they're stored in a private Blob
    // store -- the resulting URL is not fetchable without authentication.
    // The admin dashboard reads files back through /api/cvs/[id]/file.
    let blob;
    try {
      blob = await put(blobPath, file, {
        access: "private",
        addRandomSuffix: true,
      });
    } catch (err) {
      console.error("CV upload to Blob failed", err);
      const detail =
        err instanceof Error ? err.message.slice(0, 160) : "unknown error";
      return NextResponse.json(
        { error: `File storage error: ${detail}` },
        { status: 500 }
      );
    }

    const data = parsed.data;

    let cv;
    try {
      cv = await prisma.cV.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        domain: data.domain,
        industry: data.industry,
        degree: data.degree,
        gender: data.gender,
        age: data.age,
        pwd: data.pwd,
        experienceYears: data.experienceYears ?? null,
        currentRole: data.currentRole || null,
        currentCompany: data.currentCompany || null,
        education: data.education || null,
        skills: data.skills || null,
        city: data.city || null,
        fileUrl: blob.url,
        filePathname: blob.pathname,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || null,
      },
      });
    } catch (err) {
      console.error("CV database insert failed", err);
      // Don't leave an orphaned file behind when the record couldn't be saved.
      try {
        await del(blob.url);
      } catch (cleanupErr) {
        console.warn("Could not clean up blob after DB failure", cleanupErr);
      }
      return NextResponse.json(
        { error: `Database error${errorHint(err)}. Please try again later.` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: cv.id }, { status: 201 });
  } catch (err) {
    console.error("CV submission failed", err);
    return NextResponse.json(
      { error: "Something went wrong while submitting your CV. Please try again." },
      { status: 500 }
    );
  }
}

// ---------- GET /api/cvs -- admin listing with filters ----------
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Multi-value filters arrive as comma-separated lists.
    const list = (name: string) =>
      (searchParams.get(name) ?? "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    const domains = list("domains"); // professions
    const industries = list("industries");
    const degrees = list("degrees");
    const genders = list("genders");
    const locations = list("locations");

    const intParam = (name: string) => {
      const raw = searchParams.get(name);
      if (raw === null || raw.trim() === "") return undefined;
      const n = Number(raw);
      return Number.isInteger(n) && n >= 0 && n <= 120 ? n : undefined;
    };
    const ageMin = intParam("ageMin");
    const ageMax = intParam("ageMax");
    const pwdOnly = searchParams.get("pwd") === "1";

    const search = searchParams.get("search")?.trim();
    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number(searchParams.get("pageSize") ?? "25") || 25)
    );
    const sort = searchParams.get("sort") ?? "newest";

    // Every active filter narrows the result, so they are combined with AND.
    const and: any[] = [];

    if (domains.length > 0) and.push({ domain: { in: domains } });
    if (industries.length > 0) and.push({ industry: { in: industries } });
    if (degrees.length > 0) and.push({ degree: { in: degrees } });
    if (genders.length > 0) and.push({ gender: { in: genders } });
    if (pwdOnly) and.push({ pwd: true });

    // Locations are typed by candidates, so "islamabad" and "Islamabad" must match.
    if (locations.length > 0) {
      and.push({
        OR: locations.map((l) => ({ city: { equals: l, mode: "insensitive" } })),
      });
    }

    if (ageMin !== undefined || ageMax !== undefined) {
      and.push({
        age: {
          ...(ageMin !== undefined ? { gte: ageMin } : {}),
          ...(ageMax !== undefined ? { lte: ageMax } : {}),
        },
      });
    }

    if (search) {
      and.push({
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { skills: { contains: search, mode: "insensitive" } },
          { currentRole: { contains: search, mode: "insensitive" } },
          { currentCompany: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { education: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    const where: any = and.length > 0 ? { AND: and } : {};

    const orderBy =
      sort === "oldest"
        ? { createdAt: "asc" as const }
        : sort === "name"
        ? { fullName: "asc" as const }
        : sort === "experience"
        ? { experienceYears: "desc" as const }
        : { createdAt: "desc" as const };

    const [items, total] = await Promise.all([
      prisma.cV.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.cV.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (err) {
    console.error("Failed to list CVs", err);
    return NextResponse.json(
      { error: "Failed to load CVs" },
      { status: 500 }
    );
  }
}
