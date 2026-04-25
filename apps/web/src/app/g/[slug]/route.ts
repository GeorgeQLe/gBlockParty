import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { loadAllGBlocks } from "@/lib/content";

function resolveContentRoot(): string {
  const candidate = path.join(process.cwd(), "content");
  if (fs.existsSync(candidate)) return candidate;
  return path.resolve(process.cwd(), "../../content");
}

const contentRoot = resolveContentRoot();

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const blocks = loadAllGBlocks({ contentRoot });
  const block = blocks.find((b) => b.slug === slug);

  if (!block) {
    return new NextResponse("Not found", { status: 404 });
  }

  const url = new URL(`/${block.collection}/${block.slug}`, _request.url);
  return NextResponse.redirect(url, 301);
}
