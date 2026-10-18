-- MySQL dump 10.13  Distrib 26.7.0, for Win64 (x86_64)
--
-- Host: localhost    Database: placement_management
-- ------------------------------------------------------
-- Server version	26.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'b5b59698-c193-11f1-bfa0-6c0b5e16efd5:1-134';

--
-- Current Database: `placement_management`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `placement_management` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `placement_management`;

--
-- Table structure for table `alembic_version`
--

DROP TABLE IF EXISTS `alembic_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alembic_version` (
  `version_num` varchar(32) NOT NULL,
  PRIMARY KEY (`version_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `application_decision_history`
--

DROP TABLE IF EXISTS `application_decision_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_decision_history` (
  `application_id` binary(16) NOT NULL,
  `action_type` varchar(20) NOT NULL,
  `decision` varchar(20) NOT NULL,
  `waitlist_rank` int DEFAULT NULL,
  `actor_user_id` binary(16) DEFAULT NULL,
  `occurred_at` datetime NOT NULL,
  `id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `application_id` (`application_id`),
  KEY `actor_user_id` (`actor_user_id`),
  CONSTRAINT `application_decision_history_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`),
  CONSTRAINT `application_decision_history_ibfk_2` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `application_decisions`
--

DROP TABLE IF EXISTS `application_decisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_decisions` (
  `application_id` binary(16) NOT NULL,
  `decision` varchar(20) NOT NULL,
  `waitlist_rank` int DEFAULT NULL,
  `internal_note` text,
  `student_message` text,
  `published_at` datetime DEFAULT NULL,
  PRIMARY KEY (`application_id`),
  CONSTRAINT `application_decisions_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `application_status_history`
--

DROP TABLE IF EXISTS `application_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_status_history` (
  `application_id` binary(16) NOT NULL,
  `from_status` varchar(32) DEFAULT NULL,
  `to_status` varchar(32) NOT NULL,
  `actor_user_id` binary(16) DEFAULT NULL,
  `reason` varchar(1000) DEFAULT NULL,
  `changed_at` datetime NOT NULL,
  `id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `application_id` (`application_id`),
  KEY `actor_user_id` (`actor_user_id`),
  CONSTRAINT `application_status_history_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`),
  CONSTRAINT `application_status_history_ibfk_2` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `student_id` binary(16) NOT NULL,
  `job_posting_id` binary(16) NOT NULL,
  `resume_id` binary(16) DEFAULT NULL,
  `current_status` varchar(32) NOT NULL,
  `eligibility_passed` tinyint(1) NOT NULL,
  `eligibility_snapshot` json NOT NULL,
  `criteria_version` int NOT NULL,
  `applied_at` datetime NOT NULL,
  `id` binary(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`,`job_posting_id`),
  KEY `job_posting_id` (`job_posting_id`),
  KEY `resume_id` (`resume_id`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student_profiles` (`user_id`),
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`job_posting_id`) REFERENCES `job_postings` (`id`),
  CONSTRAINT `applications_ibfk_3` FOREIGN KEY (`resume_id`) REFERENCES `student_resumes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `audit_events`
--

DROP TABLE IF EXISTS `audit_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_events` (
  `actor_user_id` binary(16) DEFAULT NULL,
  `action_code` varchar(80) NOT NULL,
  `entity_type` varchar(80) NOT NULL,
  `entity_id` binary(16) DEFAULT NULL,
  `metadata_json` json DEFAULT NULL,
  `occurred_at` datetime NOT NULL,
  `id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `actor_user_id` (`actor_user_id`),
  CONSTRAINT `audit_events_ibfk_1` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `legal_name` varchar(200) NOT NULL,
  `display_name` varchar(160) NOT NULL,
  `industry` varchar(120) DEFAULT NULL,
  `website` varchar(512) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `id` binary(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now()),
  `package_lpa` decimal(10,2) DEFAULT NULL,
  `eligibility_cgpa` decimal(4,2) DEFAULT NULL,
  `positions` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `code` varchar(40) NOT NULL,
  `name` varchar(160) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `id` binary(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `interview_history`
--

DROP TABLE IF EXISTS `interview_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interview_history` (
  `interview_id` binary(16) NOT NULL,
  `event_type` varchar(32) NOT NULL,
  `old_start` datetime DEFAULT NULL,
  `new_start` datetime DEFAULT NULL,
  `reason` varchar(1000) DEFAULT NULL,
  `actor_user_id` binary(16) DEFAULT NULL,
  `occurred_at` datetime NOT NULL,
  `id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `interview_id` (`interview_id`),
  KEY `actor_user_id` (`actor_user_id`),
  CONSTRAINT `interview_history_ibfk_1` FOREIGN KEY (`interview_id`) REFERENCES `interviews` (`id`),
  CONSTRAINT `interview_history_ibfk_2` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `interview_participants`
--

DROP TABLE IF EXISTS `interview_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interview_participants` (
  `interview_id` binary(16) NOT NULL,
  `user_id` binary(16) NOT NULL,
  `participant_role` varchar(20) NOT NULL,
  PRIMARY KEY (`interview_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `interview_participants_ibfk_1` FOREIGN KEY (`interview_id`) REFERENCES `interviews` (`id`),
  CONSTRAINT `interview_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `interview_results`
--

DROP TABLE IF EXISTS `interview_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interview_results` (
  `interview_id` binary(16) NOT NULL,
  `outcome` varchar(20) NOT NULL,
  `internal_feedback` text,
  `student_feedback` text,
  `published_at` datetime DEFAULT NULL,
  PRIMARY KEY (`interview_id`),
  CONSTRAINT `interview_results_ibfk_1` FOREIGN KEY (`interview_id`) REFERENCES `interviews` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `interview_slots`
--

DROP TABLE IF EXISTS `interview_slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interview_slots` (
  `job_posting_id` binary(16) NOT NULL,
  `starts_at` datetime NOT NULL,
  `ends_at` datetime NOT NULL,
  `capacity` int NOT NULL,
  `status` varchar(20) NOT NULL,
  `id` binary(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `job_posting_id` (`job_posting_id`),
  CONSTRAINT `interview_slots_ibfk_1` FOREIGN KEY (`job_posting_id`) REFERENCES `job_postings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `interviews`
--

DROP TABLE IF EXISTS `interviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interviews` (
  `application_id` binary(16) NOT NULL,
  `slot_id` binary(16) DEFAULT NULL,
  `round_number` int NOT NULL,
  `attempt_number` int NOT NULL,
  `starts_at` datetime NOT NULL,
  `ends_at` datetime NOT NULL,
  `status` varchar(20) NOT NULL,
  `id` binary(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `application_id` (`application_id`,`round_number`,`attempt_number`),
  KEY `slot_id` (`slot_id`),
  CONSTRAINT `interviews_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`),
  CONSTRAINT `interviews_ibfk_2` FOREIGN KEY (`slot_id`) REFERENCES `interview_slots` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `job_departments`
--

DROP TABLE IF EXISTS `job_departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_departments` (
  `job_id` binary(16) NOT NULL,
  `department_id` binary(16) NOT NULL,
  PRIMARY KEY (`job_id`,`department_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `job_departments_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job_postings` (`id`),
  CONSTRAINT `job_departments_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `job_posting_revisions`
--

DROP TABLE IF EXISTS `job_posting_revisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_posting_revisions` (
  `job_id` binary(16) NOT NULL,
  `revision_no` int NOT NULL,
  `revision_type` varchar(32) NOT NULL,
  `snapshot` json NOT NULL,
  `created_at` datetime NOT NULL,
  `id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `job_id` (`job_id`,`revision_no`),
  CONSTRAINT `job_posting_revisions_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job_postings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `job_postings`
--

DROP TABLE IF EXISTS `job_postings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_postings` (
  `company_id` binary(16) NOT NULL,
  `drive_id` binary(16) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `openings` int NOT NULL,
  `min_cgpa` decimal(4,2) DEFAULT NULL,
  `max_active_backlogs` int DEFAULT NULL,
  `max_historical_backlogs` int DEFAULT NULL,
  `all_departments_allowed` tinyint(1) NOT NULL,
  `application_open_at` datetime NOT NULL,
  `application_deadline` datetime NOT NULL,
  `status` varchar(20) NOT NULL,
  `criteria_version` int NOT NULL,
  `id` binary(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now()),
  `package_lpa` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  KEY `drive_id` (`drive_id`),
  CONSTRAINT `job_postings_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  CONSTRAINT `job_postings_ibfk_2` FOREIGN KEY (`drive_id`) REFERENCES `placement_drives` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `job_skills`
--

DROP TABLE IF EXISTS `job_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_skills` (
  `job_id` binary(16) NOT NULL,
  `skill_id` binary(16) NOT NULL,
  `is_required` tinyint(1) NOT NULL,
  `minimum_proficiency` int DEFAULT NULL,
  PRIMARY KEY (`job_id`,`skill_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `job_skills_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job_postings` (`id`),
  CONSTRAINT `job_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `placement_drives`
--

DROP TABLE IF EXISTS `placement_drives`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `placement_drives` (
  `name` varchar(160) NOT NULL,
  `academic_year` varchar(16) NOT NULL,
  `starts_at` datetime NOT NULL,
  `ends_at` datetime NOT NULL,
  `status` varchar(20) NOT NULL,
  `id` binary(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recruiter_company_memberships`
--

DROP TABLE IF EXISTS `recruiter_company_memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recruiter_company_memberships` (
  `recruiter_user_id` binary(16) NOT NULL,
  `company_id` binary(16) NOT NULL,
  `membership_role` varchar(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`recruiter_user_id`,`company_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `recruiter_company_memberships_ibfk_1` FOREIGN KEY (`recruiter_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `recruiter_company_memberships_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `refresh_sessions`
--

DROP TABLE IF EXISTS `refresh_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_sessions` (
  `user_id` binary(16) NOT NULL,
  `token_hash` binary(32) NOT NULL,
  `expires_at` datetime NOT NULL,
  `revoked_at` datetime DEFAULT NULL,
  `replaced_by_session_id` binary(16) DEFAULT NULL,
  `user_agent` varchar(512) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `id` binary(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_hash` (`token_hash`),
  KEY `replaced_by_session_id` (`replaced_by_session_id`),
  KEY `ix_refresh_sessions_user_id` (`user_id`),
  CONSTRAINT `refresh_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `refresh_sessions_ibfk_2` FOREIGN KEY (`replaced_by_session_id`) REFERENCES `refresh_sessions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `report_exports`
--

DROP TABLE IF EXISTS `report_exports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_exports` (
  `requester_user_id` binary(16) NOT NULL,
  `report_type` varchar(30) NOT NULL,
  `filters` json NOT NULL,
  `status` varchar(20) NOT NULL,
  `object_key` varchar(512) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `id` binary(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `requester_user_id` (`requester_user_id`),
  CONSTRAINT `report_exports_ibfk_1` FOREIGN KEY (`requester_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_code` varchar(40) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `normalized_name` varchar(120) NOT NULL,
  `display_name` varchar(120) NOT NULL,
  `id` binary(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `normalized_name` (`normalized_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_profiles`
--

DROP TABLE IF EXISTS `student_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_profiles` (
  `user_id` binary(16) NOT NULL,
  `roll_number` varchar(64) NOT NULL,
  `department_id` binary(16) NOT NULL,
  `program` varchar(120) NOT NULL,
  `graduation_year` int NOT NULL,
  `cgpa` decimal(4,2) DEFAULT NULL,
  `active_backlogs` int NOT NULL,
  `historical_backlogs` int NOT NULL,
  `profile_status` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now()),
  `phone` varchar(32) DEFAULT NULL,
  `semester` int DEFAULT NULL,
  `tenth_percentage` decimal(5,2) DEFAULT NULL,
  `twelfth_percentage` decimal(5,2) DEFAULT NULL,
  `linkedin_url` varchar(512) DEFAULT NULL,
  `github_url` varchar(512) DEFAULT NULL,
  `portfolio_url` varchar(512) DEFAULT NULL,
  `skills` json DEFAULT NULL,
  `projects` json DEFAULT NULL,
  `certifications` json DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `roll_number` (`roll_number`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `student_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `student_profiles_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_resumes`
--

DROP TABLE IF EXISTS `student_resumes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_resumes` (
  `student_id` binary(16) NOT NULL,
  `object_key` varchar(512) NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `content_type` varchar(127) NOT NULL,
  `byte_size` int NOT NULL,
  `checksum_sha256` binary(32) NOT NULL,
  `is_current` tinyint(1) NOT NULL,
  `uploaded_at` datetime NOT NULL,
  `id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `object_key` (`object_key`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `student_resumes_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student_profiles` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_skills`
--

DROP TABLE IF EXISTS `student_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_skills` (
  `student_id` binary(16) NOT NULL,
  `skill_id` binary(16) NOT NULL,
  `proficiency` int DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL,
  PRIMARY KEY (`student_id`,`skill_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `student_skills_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student_profiles` (`user_id`),
  CONSTRAINT `student_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_invitations`
--

DROP TABLE IF EXISTS `user_invitations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_invitations` (
  `user_id` binary(16) NOT NULL,
  `token_hash` binary(32) NOT NULL,
  `expires_at` datetime NOT NULL,
  `redeemed_at` datetime DEFAULT NULL,
  `created_by_user_id` binary(16) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_hash` (`token_hash`),
  KEY `created_by_user_id` (`created_by_user_id`),
  KEY `ix_user_invitations_user_id` (`user_id`),
  CONSTRAINT `user_invitations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_invitations_ibfk_2` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` binary(16) NOT NULL,
  `role_id` binary(16) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `granted_by_user_id` binary(16) DEFAULT NULL,
  `granted_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  KEY `granted_by_user_id` (`granted_by_user_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `user_roles_ibfk_3` FOREIGN KEY (`granted_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `email_normalized` varchar(254) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `display_name` varchar(160) NOT NULL,
  `account_status` varchar(20) NOT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `created_by_user_id` binary(16) DEFAULT NULL,
  `updated_by_user_id` binary(16) DEFAULT NULL,
  `id` binary(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_users_email_normalized` (`email_normalized`),
  KEY `created_by_user_id` (`created_by_user_id`),
  KEY `updated_by_user_id` (`updated_by_user_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'placement_management'
--

--
-- Dumping routines for database 'placement_management'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-18 16:55:37
