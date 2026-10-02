-- Only if you already created the tables with the older schema.sql
USE manaksetu;
ALTER TABLE chunks ADD COLUMN embedding JSON NULL;
