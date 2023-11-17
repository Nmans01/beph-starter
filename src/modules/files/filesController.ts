import Elysia, { t } from "elysia";
import { s3Service } from "../integrations/s3Service";
import { FileUploadResponse, Files } from "./components/FileUploadResponse";

export const filesController = new Elysia({ prefix: "/files" })
    .use(s3Service)

    .state({ files: ["ext.png"] })

    .get("", ({ store: { files } }) => Files({ files }))

    .post("", async ({ body: { file }, putToS3 }) => {
        console.log("upload", file.name, file.size, file.type);
        const res = await putToS3(file);
        console.log("upload", res);
        return FileUploadResponse({});
    }, { body: t.Object({ file: t.File() }) })
