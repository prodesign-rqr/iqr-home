import { NextRequest, NextResponse } from "next/server";
import { answerQuestion } from "../../../lib/intent-engine";
 
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
 
  if (!body || typeof body.question !== "string" || !body.question.trim()) {
    return NextResponse.json(
      {
        ok: false,
        response: "No record found."
      },
      { status: 400 }
    );
  }
 
  const result = answerQuestion(body.question.trim());
 
  return NextResponse.json({
    ok: true,
    intent: result.intent,
    response: result.response
  });
}
