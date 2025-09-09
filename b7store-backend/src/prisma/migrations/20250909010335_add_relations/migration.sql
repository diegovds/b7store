-- AddForeignKey
ALTER TABLE "public"."ProductMetadata" ADD CONSTRAINT "ProductMetadata_metadataValueId_fkey" FOREIGN KEY ("metadataValueId") REFERENCES "public"."MetadataValue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
