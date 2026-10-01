CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);

CREATE TABLE `academicClasses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`name` varchar(160) NOT NULL,
	`course` varchar(160) NOT NULL,
	`academicPeriod` varchar(64) NOT NULL,
	`status` enum('active','archived') NOT NULL DEFAULT 'active',
	`createdByUserId` int NOT NULL,
	`archivedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `academicClasses_id` PRIMARY KEY(`id`),
	CONSTRAINT `classes_code_uq` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorUserId` int,
	`action` varchar(120) NOT NULL,
	`entityType` varchar(96) NOT NULL,
	`entityId` int,
	`previousState` varchar(96),
	`nextState` varchar(96),
	`reason` text,
	`details` json,
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classEnrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`classId` int NOT NULL,
	`studentUserId` int NOT NULL,
	`status` enum('active','ended') NOT NULL DEFAULT 'active',
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`endedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `classEnrollments_id` PRIMARY KEY(`id`),
	CONSTRAINT `class_enrollment_uq` UNIQUE(`classId`,`studentUserId`)
);
--> statement-breakpoint
CREATE TABLE `classTeachers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`classId` int NOT NULL,
	`teacherUserId` int NOT NULL,
	`role` enum('primary','collaborator') NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`endedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `classTeachers_id` PRIMARY KEY(`id`),
	CONSTRAINT `class_teacher_uq` UNIQUE(`classId`,`teacherUserId`)
);
--> statement-breakpoint
CREATE TABLE `dataExportLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestedByUserId` int NOT NULL,
	`scope` varchar(160) NOT NULL,
	`justification` text NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dataExportLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dataRetentionHolds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subjectUserId` int,
	`reason` text NOT NULL,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`endedAt` timestamp,
	`createdByUserId` int NOT NULL,
	CONSTRAINT `dataRetentionHolds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `equipment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`name` varchar(160) NOT NULL,
	`category` varchar(96) NOT NULL,
	`description` text,
	`specifications` text,
	`active` boolean NOT NULL DEFAULT true,
	`available` boolean NOT NULL DEFAULT true,
	`maintenanceIntervalDays` int NOT NULL,
	`nextMaintenanceAt` timestamp NOT NULL,
	`lastMaintenanceAt` timestamp,
	`dailyReservationLimitHours` int NOT NULL DEFAULT 4,
	`createdByUserId` int NOT NULL,
	`archivedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `equipment_id` PRIMARY KEY(`id`),
	CONSTRAINT `equipment_code_uq` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `equipmentReservations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`equipmentId` int NOT NULL,
	`requesterUserId` int NOT NULL,
	`projectId` int,
	`status` enum('confirmed','cancelled','no_show','completed') NOT NULL DEFAULT 'confirmed',
	`purpose` varchar(280) NOT NULL,
	`startsAt` timestamp NOT NULL,
	`endsAt` timestamp NOT NULL,
	`cancelledAt` timestamp,
	`cancellationReason` text,
	`noShowRecordedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `equipmentReservations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `maintenanceChecklistExecutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`maintenanceId` int NOT NULL,
	`checklistItemId` int NOT NULL,
	`completedByUserId` int,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `maintenanceChecklistExecutions_id` PRIMARY KEY(`id`),
	CONSTRAINT `maintenance_checklist_uq` UNIQUE(`maintenanceId`,`checklistItemId`)
);
--> statement-breakpoint
CREATE TABLE `maintenanceChecklistItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`equipmentId` int NOT NULL,
	`label` varchar(280) NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `maintenanceChecklistItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `maintenanceRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`equipmentId` int NOT NULL,
	`type` enum('preventive','corrective') NOT NULL,
	`status` enum('scheduled','open','in_progress','overdue','completed','cancelled') NOT NULL,
	`description` text NOT NULL,
	`reportedByUserId` int,
	`assessment` text,
	`executorName` varchar(180),
	`scheduledStartsAt` timestamp,
	`scheduledEndsAt` timestamp,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`outcome` enum('released','kept_unavailable'),
	`completionSummary` text,
	`cancelledAt` timestamp,
	`cancellationReason` text,
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `maintenanceRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `materialRequestItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`materialId` int NOT NULL,
	`requestedQuantity` decimal(14,3) NOT NULL,
	`reservedQuantity` decimal(14,3) NOT NULL DEFAULT '0.000',
	`deliveredQuantity` decimal(14,3) NOT NULL DEFAULT '0.000',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `materialRequestItems_id` PRIMARY KEY(`id`),
	CONSTRAINT `request_material_uq` UNIQUE(`requestId`,`materialId`)
);
--> statement-breakpoint
CREATE TABLE `materialRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requesterUserId` int NOT NULL,
	`projectId` int NOT NULL,
	`status` enum('draft','pending_approval','in_review','approved_awaiting_pickup','partially_delivered','delivered','rejected','cancelled','expired','closed_inactive') NOT NULL DEFAULT 'draft',
	`purpose` varchar(280) NOT NULL,
	`reviewerUserId` int,
	`reviewerComment` text,
	`submittedAt` timestamp,
	`firstDecisionAt` timestamp,
	`approvedAt` timestamp,
	`pickupDeadlineAt` timestamp,
	`extensionUsed` boolean NOT NULL DEFAULT false,
	`cancelledAt` timestamp,
	`cancellationReason` text,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `materialRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`name` varchar(160) NOT NULL,
	`description` text,
	`category` varchar(96) NOT NULL,
	`unit` enum('unit','gram','meter','milliliter') NOT NULL,
	`specifications` text,
	`availableQuantity` decimal(14,3) NOT NULL DEFAULT '0.000',
	`reservedQuantity` decimal(14,3) NOT NULL DEFAULT '0.000',
	`minimumQuantity` decimal(14,3) NOT NULL DEFAULT '0.000',
	`active` boolean NOT NULL DEFAULT true,
	`createdByUserId` int NOT NULL,
	`archivedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `materials_id` PRIMARY KEY(`id`),
	CONSTRAINT `materials_code_uq` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `privacyIncidents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`status` enum('reported','contained','assessed','closed') NOT NULL DEFAULT 'reported',
	`summary` text NOT NULL,
	`affectedDataCategories` text,
	`containmentActions` text,
	`riskAssessment` text,
	`externalCommunicationDecision` text,
	`reportedByUserId` int,
	`assignedToUserId` int,
	`reportedAt` timestamp NOT NULL DEFAULT (now()),
	`containedAt` timestamp,
	`assessedAt` timestamp,
	`closedAt` timestamp,
	CONSTRAINT `privacyIncidents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `privacyNoticeAcknowledgements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`noticeVersionId` int NOT NULL,
	`userId` int NOT NULL,
	`acknowledgedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `privacyNoticeAcknowledgements_id` PRIMARY KEY(`id`),
	CONSTRAINT `privacy_notice_user_uq` UNIQUE(`noticeVersionId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `privacyNoticeVersions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`version` varchar(40) NOT NULL,
	`content` text NOT NULL,
	`effectiveAt` timestamp NOT NULL,
	`isMaterialChange` boolean NOT NULL DEFAULT false,
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `privacyNoticeVersions_id` PRIMARY KEY(`id`),
	CONSTRAINT `privacy_notice_version_uq` UNIQUE(`version`)
);
--> statement-breakpoint
CREATE TABLE `privacyRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requesterUserId` int,
	`requestType` varchar(96) NOT NULL,
	`status` enum('received','identity_verified','in_progress','completed','denied') NOT NULL DEFAULT 'received',
	`identityVerifiedAt` timestamp,
	`decision` text,
	`responseSummary` text,
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`handledByUserId` int,
	CONSTRAINT `privacyRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`studentUserId` int NOT NULL,
	`status` enum('active','ended') NOT NULL DEFAULT 'active',
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`leftAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectMembers_id` PRIMARY KEY(`id`),
	CONSTRAINT `project_member_uq` UNIQUE(`projectId`,`studentUserId`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`classId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text NOT NULL,
	`status` enum('planned','in_progress','completed','archived') NOT NULL DEFAULT 'planned',
	`createdByUserId` int NOT NULL,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`archivedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `projects_code_uq` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `stockMovements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`materialId` int NOT NULL,
	`requestId` int,
	`type` enum('entry','delivery','return','adjustment','reversal') NOT NULL,
	`quantity` decimal(14,3) NOT NULL,
	`reason` text,
	`performedByUserId` int,
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stockMovements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userDataLifecycles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deactivatedAt` timestamp,
	`anonymizedAt` timestamp,
	`scheduledDeletionAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userDataLifecycles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_lifecycle_user_uq` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','student','teacher','admin') NOT NULL DEFAULT 'student';--> statement-breakpoint
ALTER TABLE `academicClasses` ADD CONSTRAINT `academicClasses_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `auditLogs` ADD CONSTRAINT `auditLogs_actorUserId_users_id_fk` FOREIGN KEY (`actorUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classEnrollments` ADD CONSTRAINT `classEnrollments_classId_academicClasses_id_fk` FOREIGN KEY (`classId`) REFERENCES `academicClasses`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classEnrollments` ADD CONSTRAINT `classEnrollments_studentUserId_users_id_fk` FOREIGN KEY (`studentUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classTeachers` ADD CONSTRAINT `classTeachers_classId_academicClasses_id_fk` FOREIGN KEY (`classId`) REFERENCES `academicClasses`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classTeachers` ADD CONSTRAINT `classTeachers_teacherUserId_users_id_fk` FOREIGN KEY (`teacherUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dataExportLogs` ADD CONSTRAINT `dataExportLogs_requestedByUserId_users_id_fk` FOREIGN KEY (`requestedByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dataRetentionHolds` ADD CONSTRAINT `dataRetentionHolds_subjectUserId_users_id_fk` FOREIGN KEY (`subjectUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dataRetentionHolds` ADD CONSTRAINT `dataRetentionHolds_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `equipment` ADD CONSTRAINT `equipment_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `equipmentReservations` ADD CONSTRAINT `equipmentReservations_equipmentId_equipment_id_fk` FOREIGN KEY (`equipmentId`) REFERENCES `equipment`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `equipmentReservations` ADD CONSTRAINT `equipmentReservations_requesterUserId_users_id_fk` FOREIGN KEY (`requesterUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `equipmentReservations` ADD CONSTRAINT `equipmentReservations_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `equipmentReservations` ADD CONSTRAINT `equipmentReservations_noShowRecordedByUserId_users_id_fk` FOREIGN KEY (`noShowRecordedByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `maintenanceChecklistExecutions` ADD CONSTRAINT `mce_maintenance_fk` FOREIGN KEY (`maintenanceId`) REFERENCES `maintenanceRecords`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `maintenanceChecklistExecutions` ADD CONSTRAINT `mce_checklist_item_fk` FOREIGN KEY (`checklistItemId`) REFERENCES `maintenanceChecklistItems`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `maintenanceChecklistExecutions` ADD CONSTRAINT `mce_completed_by_fk` FOREIGN KEY (`completedByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `maintenanceChecklistItems` ADD CONSTRAINT `mci_equipment_fk` FOREIGN KEY (`equipmentId`) REFERENCES `equipment`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `maintenanceChecklistItems` ADD CONSTRAINT `mci_created_by_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `maintenanceRecords` ADD CONSTRAINT `maintenance_equipment_fk` FOREIGN KEY (`equipmentId`) REFERENCES `equipment`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `maintenanceRecords` ADD CONSTRAINT `maintenance_reported_by_fk` FOREIGN KEY (`reportedByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `maintenanceRecords` ADD CONSTRAINT `maintenance_created_by_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materialRequestItems` ADD CONSTRAINT `materialRequestItems_requestId_materialRequests_id_fk` FOREIGN KEY (`requestId`) REFERENCES `materialRequests`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materialRequestItems` ADD CONSTRAINT `materialRequestItems_materialId_materials_id_fk` FOREIGN KEY (`materialId`) REFERENCES `materials`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materialRequests` ADD CONSTRAINT `materialRequests_requesterUserId_users_id_fk` FOREIGN KEY (`requesterUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materialRequests` ADD CONSTRAINT `materialRequests_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materialRequests` ADD CONSTRAINT `materialRequests_reviewerUserId_users_id_fk` FOREIGN KEY (`reviewerUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materials` ADD CONSTRAINT `materials_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `privacyIncidents` ADD CONSTRAINT `privacyIncidents_reportedByUserId_users_id_fk` FOREIGN KEY (`reportedByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `privacyIncidents` ADD CONSTRAINT `privacyIncidents_assignedToUserId_users_id_fk` FOREIGN KEY (`assignedToUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `privacyNoticeAcknowledgements` ADD CONSTRAINT `privacy_notice_ack_version_fk` FOREIGN KEY (`noticeVersionId`) REFERENCES `privacyNoticeVersions`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `privacyNoticeAcknowledgements` ADD CONSTRAINT `privacy_notice_ack_user_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `privacyNoticeVersions` ADD CONSTRAINT `privacyNoticeVersions_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `privacyRequests` ADD CONSTRAINT `privacyRequests_requesterUserId_users_id_fk` FOREIGN KEY (`requesterUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `privacyRequests` ADD CONSTRAINT `privacyRequests_handledByUserId_users_id_fk` FOREIGN KEY (`handledByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectMembers` ADD CONSTRAINT `projectMembers_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectMembers` ADD CONSTRAINT `projectMembers_studentUserId_users_id_fk` FOREIGN KEY (`studentUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_classId_academicClasses_id_fk` FOREIGN KEY (`classId`) REFERENCES `academicClasses`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stockMovements` ADD CONSTRAINT `stockMovements_materialId_materials_id_fk` FOREIGN KEY (`materialId`) REFERENCES `materials`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stockMovements` ADD CONSTRAINT `stockMovements_requestId_materialRequests_id_fk` FOREIGN KEY (`requestId`) REFERENCES `materialRequests`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stockMovements` ADD CONSTRAINT `stockMovements_performedByUserId_users_id_fk` FOREIGN KEY (`performedByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userDataLifecycles` ADD CONSTRAINT `userDataLifecycles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `classes_status_idx` ON `academicClasses` (`status`);--> statement-breakpoint
CREATE INDEX `audit_entity_idx` ON `auditLogs` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `audit_actor_time_idx` ON `auditLogs` (`actorUserId`,`occurredAt`);--> statement-breakpoint
CREATE INDEX `class_enrollments_student_idx` ON `classEnrollments` (`studentUserId`);--> statement-breakpoint
CREATE INDEX `class_teachers_user_idx` ON `classTeachers` (`teacherUserId`);--> statement-breakpoint
CREATE INDEX `exports_requester_time_idx` ON `dataExportLogs` (`requestedByUserId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `retention_holds_subject_idx` ON `dataRetentionHolds` (`subjectUserId`);--> statement-breakpoint
CREATE INDEX `equipment_availability_idx` ON `equipment` (`active`,`available`);--> statement-breakpoint
CREATE INDEX `reservations_equipment_time_idx` ON `equipmentReservations` (`equipmentId`,`startsAt`,`endsAt`);--> statement-breakpoint
CREATE INDEX `reservations_requester_time_idx` ON `equipmentReservations` (`requesterUserId`,`startsAt`);--> statement-breakpoint
CREATE INDEX `reservations_status_idx` ON `equipmentReservations` (`status`);--> statement-breakpoint
CREATE INDEX `checklist_equipment_idx` ON `maintenanceChecklistItems` (`equipmentId`,`active`);--> statement-breakpoint
CREATE INDEX `maintenance_equipment_status_idx` ON `maintenanceRecords` (`equipmentId`,`status`);--> statement-breakpoint
CREATE INDEX `maintenance_schedule_idx` ON `maintenanceRecords` (`scheduledStartsAt`);--> statement-breakpoint
CREATE INDEX `request_items_material_idx` ON `materialRequestItems` (`materialId`);--> statement-breakpoint
CREATE INDEX `requests_requester_status_idx` ON `materialRequests` (`requesterUserId`,`status`);--> statement-breakpoint
CREATE INDEX `requests_project_status_idx` ON `materialRequests` (`projectId`,`status`);--> statement-breakpoint
CREATE INDEX `requests_status_idx` ON `materialRequests` (`status`);--> statement-breakpoint
CREATE INDEX `materials_active_category_idx` ON `materials` (`active`,`category`);--> statement-breakpoint
CREATE INDEX `privacy_incidents_status_idx` ON `privacyIncidents` (`status`);--> statement-breakpoint
CREATE INDEX `privacy_requests_status_idx` ON `privacyRequests` (`status`);--> statement-breakpoint
CREATE INDEX `privacy_requests_user_idx` ON `privacyRequests` (`requesterUserId`);--> statement-breakpoint
CREATE INDEX `project_members_student_idx` ON `projectMembers` (`studentUserId`);--> statement-breakpoint
CREATE INDEX `projects_class_status_idx` ON `projects` (`classId`,`status`);--> statement-breakpoint
CREATE INDEX `stock_material_time_idx` ON `stockMovements` (`materialId`,`occurredAt`);--> statement-breakpoint
CREATE INDEX `stock_request_idx` ON `stockMovements` (`requestId`);--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);
ALTER TABLE `equipmentReservations` ADD `classId` int;--> statement-breakpoint
ALTER TABLE `equipmentReservations` ADD CONSTRAINT `reservation_class_fk` FOREIGN KEY (`classId`) REFERENCES `academicClasses`(`id`) ON DELETE restrict ON UPDATE no action;
ALTER TABLE `stockMovements` ADD `originalMovementId` int;--> statement-breakpoint
ALTER TABLE `stockMovements` ADD CONSTRAINT `stock_movement_origin_fk` FOREIGN KEY (`originalMovementId`) REFERENCES `stockMovements`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `stock_origin_idx` ON `stockMovements` (`originalMovementId`);