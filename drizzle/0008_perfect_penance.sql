CREATE INDEX "idx_classes_published" ON "classes" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "idx_courses_published" ON "courses" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "idx_faqs_published_category" ON "faqs" USING btree ("is_published","category");--> statement-breakpoint
CREATE INDEX "idx_lifelogs_published" ON "life_logs" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "idx_posts_published_category" ON "posts" USING btree ("is_published","category");--> statement-breakpoint
CREATE INDEX "idx_series_published" ON "series" USING btree ("is_published");