import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import type { PhotoRecordScope } from "../../../../lib/database.types";

interface ImportPhotoPayload {
  source_photo_id: string;
  source_url: string;
  thumbnail_url: string;
  captured_at: string | null;
  caption: string | null;
  notes: string;
  room_id: string | null;
  zone_id: string | null;
  system_id: string | null;
  service_event_id: string | null;
  record_scope: PhotoRecordScope;
  metadata_json: Record<string, unknown>;
}

interface ImportRequestBody {
  property_id: string;
  project_id: string;
  project_name: string;
  notes: string;
  photos: ImportPhotoPayload[];
}

export async function POST(req: NextRequest) {
  let body: ImportRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { property_id, project_id, project_name, notes, photos } = body;

  if (!property_id || !project_id || !Array.isArray(photos) || photos.length === 0) {
    return NextResponse.json({ error: "property_id, project_id, and photos are required." }, { status: 400 });
  }

  const { data: batchData, error: batchError } = await supabase
    .from("import_batches")
    .insert({
      property_id,
      companycam_project_id: project_id,
      companycam_project_name: project_name || null,
      photo_count: photos.length,
      notes: notes || null,
    })
    .select("id")
    .maybeSingle();

  if (batchError || !batchData) {
    return NextResponse.json(
      { error: batchError?.message ?? "Failed to create import batch." },
      { status: 500 }
    );
  }

  const batchId = batchData.id;

  const records = photos.map((p) => ({
    property_id,
    source_type: "companycam" as const,
    source_project_id: project_id,
    source_photo_id: p.source_photo_id,
    source_url: p.source_url || null,
    thumbnail_url: p.thumbnail_url || null,
    captured_at: p.captured_at || null,
    caption: p.caption || null,
    notes: p.notes || null,
    room_id: p.room_id || null,
    zone_id: p.zone_id || null,
    system_id: p.system_id || null,
    service_event_id: p.service_event_id || null,
    record_scope: p.record_scope,
    import_batch_id: batchId,
    metadata_json: p.metadata_json ?? null,
  }));

  const { error: insertError } = await supabase.from("photo_records").insert(records);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ batch_id: batchId, photo_count: photos.length });
}
