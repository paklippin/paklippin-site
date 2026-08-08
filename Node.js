-- =============================================
-- DATABASE: paklippin_db
-- TABLES: users, sessions (optional)
-- =============================================

CREATE DATABASE IF NOT EXISTS paklippin_db;
USE paklippin_db;

-- =============================================
-- TABLE: users
-- Stores all registered user accounts
-- =============================================

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,   -- store bcrypt/argon2 hashed passwords
    is_verified BOOLEAN DEFAULT FALSE,     -- email/phone verification
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email)
);

-- =============================================
-- TABLE: user_sessions (optional)
-- For managing active login sessions (JWT or cookie-based)
-- =============================================

CREATE TABLE IF NOT EXISTS user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (session_token)
);

-- =============================================
-- TABLE: password_resets (optional)
-- For "Forgot Password" feature
-- =============================================

CREATE TABLE IF NOT EXISTS password_resets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    reset_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_token (reset_token)
);

-- =============================================
-- SAMPLE DATA (for testing)
-- =============================================

-- Insert a test user (password: "Test@123" hashed with bcrypt)
-- Note: Use your backend to hash passwords, this is just a placeholder
INSERT INTO users (full_name, email, phone, password_hash, is_verified, role)
VALUES (
    'Test User',
    'test@paklippin.com',
    '0300-1234567',
    '$2y$10$example_hash_here',  -- replace with actual bcrypt hash
    TRUE,
    'user'
);

-- =============================================
-- STORED PROCEDURE: Register New User
-- =============================================

DELIMITER //

CREATE PROCEDURE sp_register_user(
    IN p_full_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    INSERT INTO users (full_name, email, phone, password_hash)
    VALUES (p_full_name, p_email, p_phone, p_password_hash);
    
    SELECT LAST_INSERT_ID() AS user_id;
END //

DELIMITER ;

-- =============================================
-- STORED PROCEDURE: User Login
-- =============================================

DELIMITER //

CREATE PROCEDURE sp_login_user(
    IN p_email VARCHAR(100)
)
BEGIN
    SELECT id, full_name, email, password_hash, role, is_verified
    FROM users
    WHERE email = p_email;
END //

DELIMITER ;

-- =============================================
-- STORED PROCEDURE: Update Last Login
-- =============================================

DELIMITER //

CREATE PROCEDURE sp_update_last_login(
    IN p_user_id INT
)
BEGIN
    UPDATE users
    SET last_login = NOW()
    WHERE id = p_user_id;
END //

DELIMITER ;

-- =============================================
-- VIEW: Active Users (for admin dashboard)
-- =============================================

CREATE VIEW v_active_users AS
SELECT id, full_name, email, role, created_at, last_login
FROM users
WHERE is_verified = TRUE;

-- =============================================
-- TRIGGER: Auto-update timestamp on users
-- =============================================

DELIMITER //

CREATE TRIGGER trg_users_before_update
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

DELIMITER ;

-- =============================================
-- QUICK QUERIES FOR TESTING
-- =============================================

-- Check all users
SELECT * FROM users;

-- Check active sessions
SELECT * FROM user_sessions;

-- Find user by email (for login)
SELECT * FROM users WHERE email = 'test@paklippin.com';

-- Count total registrations
SELECT COUNT(*) AS total_users FROM users;

-- =============================================
-- SECURITY: Never store plain-text passwords!
-- Always hash using bcrypt, Argon2, or similar.
-- =============================================
