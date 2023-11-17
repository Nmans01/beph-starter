import { DeleteObjectCommand, GetObjectCommand, ListBucketsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import Elysia from "elysia";
import { invariant } from "../common/utils/invariant";

const [region, accessKeyId, secretAccessKey] = [
    invariant(process.env.S3_REGION, "BUCKET is not defined"),
    invariant(process.env.S3_KEY, "S3_KEY is not defined"),
    invariant(process.env.S3_SECRET, "S3_SECRET is not defined"),
];

console.log("Credentials loaded from env. Connecting to S3...");

const s3client = new S3Client({
    region, credentials: { accessKeyId, secretAccessKey }
});

console.log("S3 connected. Picking first bucket from list...");

const { Buckets } = await s3client.send(new ListBucketsCommand({}));
const Bucket = invariant(Buckets?.[0]?.Name, "Could not find bucket");

console.log("S3 bucket:", Bucket);

export const s3Service = new Elysia({ name: "s3Service" })

    .decorate({
        putToS3: async (file: File) => {
            const Body = Buffer.from(await file.arrayBuffer())
            return s3client
                .send(new PutObjectCommand({
                    Bucket,
                    Key: file.name,
                    Body
                }))
        },

        getFromS3: (Key: string) => s3client
            .send(new GetObjectCommand({ Bucket, Key })),

        deleteFromS3: (Key: string) => s3client
            .send(new DeleteObjectCommand({ Bucket, Key })),
    })