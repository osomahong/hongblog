import { db } from "@/lib/db";
import { lifeLogs, tags, logsToTags } from "@/lib/schema";
import { eq, inArray } from "drizzle-orm";
import { CreateLogInput, UpdateLogInput } from "./schema";

/**
 * Log Service - Database operations for logs
 */
export const logService = {
    /**
     * Create a new log with tags
     */
    async create(input: CreateLogInput) {
        const { tags: tagNames = [], ...logData } = input;

        // Insert log
        const [newLog] = await db
            .insert(lifeLogs)
            .values({
                ...logData,
                visitedAt: logData.visitedAt || null,
            })
            .returning();

        // Handle tags
        if (tagNames.length > 0) {
            await this.updateTags(newLog.id, tagNames);
        }

        return newLog;
    },

    /**
     * Update an existing log
     */
    async update(input: UpdateLogInput) {
        const { id, tags: tagNames, ...logData } = input;

        // Update log
        const [updatedLog] = await db
            .update(lifeLogs)
            .set({
                ...logData,
                updatedAt: new Date(),
            })
            .where(eq(lifeLogs.id, id))
            .returning();

        // Handle tags if provided
        if (tagNames !== undefined) {
            await this.updateTags(id, tagNames);
        }

        return updatedLog;
    },

    /**
     * Delete a log
     */
    async delete(id: number) {
        await db.delete(lifeLogs).where(eq(lifeLogs.id, id));
    },

    /**
     * Toggle published status
     */
    async togglePublished(id: number) {
        const log = await db.query.lifeLogs.findFirst({
            where: eq(lifeLogs.id, id),
        });

        if (!log) {
            throw new Error("Log not found");
        }

        const [updated] = await db
            .update(lifeLogs)
            .set({
                isPublished: !log.isPublished,
                updatedAt: new Date(),
            })
            .where(eq(lifeLogs.id, id))
            .returning();

        return updated;
    },

    /**
     * Get all logs (for admin)
     */
    async getAll(options?: { includeDrafts?: boolean }) {
        const { includeDrafts = false } = options || {};

        return db.query.lifeLogs.findMany({
            where: includeDrafts ? undefined : eq(lifeLogs.isPublished, true),
            orderBy: (lifeLogs, { desc }) => [desc(lifeLogs.createdAt)],
        });
    },

    /**
     * Update tags for a log
     */
    async updateTags(logId: number, tagNames: string[]) {
        // Delete existing tags
        await db.delete(logsToTags).where(eq(logsToTags.logId, logId));

        if (tagNames.length === 0) return;

        // Find or create tags
        const tagRecords = await Promise.all(
            tagNames.map(async (name) => {
                const existing = await db.query.tags.findFirst({
                    where: eq(tags.name, name),
                });

                if (existing) return existing;

                const [newTag] = await db
                    .insert(tags)
                    .values({ name })
                    .returning();
                return newTag;
            })
        );

        // Insert new tag associations
        await db.insert(logsToTags).values(
            tagRecords.map((tag) => ({
                logId,
                tagId: tag.id,
            }))
        );
    },
};
