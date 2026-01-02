import { NextResponse } from "next/server";
import { getPublishedFaqs } from "@/lib/queries";

export async function GET() {
  const faqs = await getPublishedFaqs();
  return NextResponse.json(faqs);
}
