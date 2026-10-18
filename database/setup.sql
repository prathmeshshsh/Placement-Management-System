-- Run as a MySQL administrator. Replace the password placeholder before executing.
-- This creates the database and application account only. Table creation and role
-- seed data are managed by backend Alembic migrations.
CREATE DATABASE IF NOT EXISTS placement_management
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'placement_app'@'localhost'
  IDENTIFIED BY 'REPLACE_WITH_A_STRONG_PASSWORD';

GRANT ALL PRIVILEGES ON placement_management.*
  TO 'placement_app'@'localhost';
FLUSH PRIVILEGES;
