import { NextRequest, NextResponse } from "next/server";
import type { CompanyCamPhoto } from "../../../../components/companycam/CompanyCamIntake";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("project_id");

  if (!projectId) {
    return NextResponse.json({ error: "project_id is required." }, { status: 400 });
  }

  const apiKey = process.env.COMPANYCAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "CompanyCam API key is not configured on this server." },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(
      `https://api.companycam.com/v2/projects/${encodeURIComponent(projectId)}/photos?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: body.message ?? `CompanyCam API error (${res.status})` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const photos: CompanyCamPhoto[] = (Array.isArray(data) ? data : data.photos ?? []).map(
      (p: Record<string, unknown>) => {
        const uris = (p.uris as { uri: string; type: string }[] | undefined) ?? [];
        const original =
          uris.find((u) => u.type === "original")?.uri ??
          (p.uri as string | undefined) ??
          "";
        const thumb =
          uris.find((u) => u.type === "thumb")?.uri ??
          uris.find((u) => u.type === "small")?.uri ??
          original;

        return {
          id: String(p.id),
          uri: original,
          thumbnail_url: thumb,
          captured_at: (p.captured_at as string | undefined) ?? null,
          caption: (p.name as string | undefined) ?? null,
        };
      }
    );

    return NextResponse.json(photos);
  } catch {
    return NextResponse.json({ error: "Failed to reach CompanyCam API." }, { status: 502 });
  }
}
