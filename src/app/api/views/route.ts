import { NextRequest, NextResponse } from "next/server";
import { recordView } from "@/lib/queries";
import { contentTypeEnum, ContentType } from "@/lib/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType, contentId } = body;

    // Validation
    if (!contentType || !contentId) {
      return NextResponse.json(
        { error: "contentType and contentId are required" },
        { status: 400 }
      );
    }

    if (!contentTypeEnum.includes(contentType as ContentType)) {
      return NextResponse.json(
        { error: "Invalid contentType. Must be 'post' or 'faq'" },
        { status: 400 }
      );
    }

    if (typeof contentId !== "number" || contentId <= 0) {
      return NextResponse.json(
        { error: "contentId must be a positive number" },
        { status: 400 }
      );
    }

    await recordView(contentType as ContentType, contentId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording view:", error);
    return NextResponse.json(
      { error: "Failed to record view" },
      { status: 500 }
    );
  }
}
