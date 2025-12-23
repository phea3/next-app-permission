ALTER TABLE `role_permissions` MODIFY COLUMN `role_id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `user_roles` MODIFY COLUMN `user_id` serial AUTO_INCREMENT NOT NULL;