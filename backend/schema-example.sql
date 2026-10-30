-- EXAMPLE ONLY.
-- First inspect your team's existing .sql schema.
-- Run this only if the team does not already have an equivalent users table.

CREATE DATABASE IF NOT EXISTS cineit;
USE cineit;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
);