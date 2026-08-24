import { ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getR2Bucket, getR2PublicUrl } from "@/lib/r2";

export type VideoItem = {
  key: string;
  url: string;
  name: string;
  uploadedAt: Date;
};

export async function listVideos(categorySlug: string): Promise<VideoItem[]> {
  const command = new ListObjectsV2Command({
    Bucket: getR2Bucket(),
    Prefix: `${categorySlug}/`,
  });

  const result = await getR2Client().send(command);
  const objects = result.Contents ?? [];
  const publicUrl = getR2PublicUrl();

  return objects
    .filter((obj) => obj.Key && !obj.Key.endsWith("/"))
    .map((obj) => {
      const key = obj.Key!;
      const filename = key.split("/").slice(1).join("/");
      return {
        key,
        url: `${publicUrl}/${key}`,
        name: filename.replace(/^\d+-/, ""),
        uploadedAt: obj.LastModified ?? new Date(0),
      };
    })
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
}

export async function deleteVideo(key: string): Promise<void> {
  await getR2Client().send(
    new DeleteObjectCommand({ Bucket: getR2Bucket(), Key: key })
  );
}
