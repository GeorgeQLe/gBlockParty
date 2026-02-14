import { uploadToS3, downloadFromS3 } from "@gblockparty/shared/backend";
import { createLogger } from "@gblockparty/shared/backend";

const logger = createLogger("build-cache");

export async function saveCache(
  bucket: string,
  projectId: string,
  branch: string,
  lockfileHash: string,
  data: Buffer,
): Promise<void> {
  // TODO: Upload cache tarball to S3
  // Key format: {projectId}/deps/{lockfileHash} for deps
  //             {projectId}/build/{branch} for framework cache
  logger.info({ projectId, branch }, "Saving build cache");
  throw new Error("Not implemented");
}

export async function restoreCache(
  bucket: string,
  projectId: string,
  branch: string,
  lockfileHash: string,
): Promise<Buffer | null> {
  // TODO: Download cache tarball from S3 if exists
  logger.info({ projectId, branch }, "Restoring build cache");
  throw new Error("Not implemented");
}
