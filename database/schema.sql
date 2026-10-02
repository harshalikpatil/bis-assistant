CREATE DATABASE IF NOT EXISTS manaksetu CHARACTER SET utf8mb4;
USE manaksetu;
-- One row per official source document you add
CREATE TABLE IF NOT EXISTS documents(
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  document_no VARCHAR(100) NULL,      -- fill only from the real document
  source_url VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Small pieces of each document; the assistant searches these
CREATE TABLE IF NOT EXISTS chunks(
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT NOT NULL,
  section VARCHAR(255) NULL,
  content TEXT NOT NULL,
  embedding JSON NULL,               -- filled by npm run ingest
  FULLTEXT KEY ft_content(content),
  FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE
);
-- Log of questions, useful for testing and improving answers
CREATE TABLE IF NOT EXISTS chat_logs(
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  lang VARCHAR(5) NOT NULL,
  had_sources BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
