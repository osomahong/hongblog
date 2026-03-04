import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import { logService } from "@/features/logs/service";
import { insertLogSchema, updateLogSchema } from "@/features/logs/schema";


// GET: 모든 logs 조회
export async function GET() {
  const session = await getServerSession();
  const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await logService.getAll({ includeDrafts: true });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}

// POST: 새 log 생성
export async function POST(request: NextRequest) {
  const session = await getServerSession();
  const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate input
    const validation = insertLogSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newLog = await logService.create(validation.data);

    // Invalidate cache for logs pages
    revalidatePath('/logs');
    revalidatePath(`/logs/${newLog.slug}`);
    revalidatePath('/');
    revalidatePath('/about/life');


    return NextResponse.json({ success: true, log: newLog });
  } catch (error) {
    console.error("Failed to create log:", error);
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}

// PUT: log 수정
export async function PUT(request: NextRequest) {
  const session = await getServerSession();
  const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate input
    const validation = updateLogSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedLog = await logService.update(validation.data);

    // Invalidate cache for logs pages
    revalidatePath('/logs');
    revalidatePath(`/logs/${updatedLog.slug}`);
    revalidatePath('/');
    revalidatePath('/about/life');
    revalidatePath(`/about/life/${updatedLog.slug}`);


    return NextResponse.json({ success: true, log: updatedLog });
  } catch (error) {
    console.error("Failed to update log:", error);
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

// DELETE: log 삭제
export async function DELETE(request: NextRequest) {
  const session = await getServerSession();
  const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID가 필요합니다." }, { status: 400 });
    }

    await logService.delete(parseInt(id, 10));

    // Invalidate cache
    revalidatePath('/logs');
    revalidatePath('/');
    revalidatePath('/about/life');


    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete log:", error);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
