-- name: GetAllApplications :many
SELECT * FROM applications WHERE user_id = $1;

-- name: GetApplicationsByStatus :many
SELECT * FROM applications WHERE status = $1 AND user_id = $2 ORDER BY updated_at DESC, created_at DESC;

-- name: GetOneApplicationByID :one
SELECT * FROM applications WHERE id = $1 AND user_id = $2;

-- name: DeleteOneApplicationByID :exec
DELETE FROM applications WHERE id = $1 AND user_id = $2;

-- name: UpdateOneApplicationByID :one
UPDATE applications SET title_application = $1, company = $2, location = $3, sent_date = $4, status = $5, notes = $6, url_application = $7 WHERE id = $8 AND user_id = $9 RETURNING *;

-- name: CreateOneApplication :one
INSERT INTO
applications ( title_application, company, location, sent_date, status, notes, url_application, user_id ) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;


-- name: GetApplicationsCount :one
SELECT COUNT(*) FROM applications WHERE user_id = $1;

-- name: GetApplicationsCountByStatus :one
SELECT COUNT(*) FROM applications WHERE user_id = $1 AND status = $2;

-- name: GetApplicationCountsByUser :one
SELECT 
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE status = 'sent') as sent_count,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count
FROM applications 
WHERE user_id = $1;

-- name: GetAllUsers :many
SELECT * FROM users;

-- name: CreateUser :one
INSERT INTO users ( name, email, password ) VALUES ($1, $2, $3) RETURNING *;

-- name: GetOneUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: GetOneUserByID :one
SELECT * FROM users WHERE id = $1;

-- name: GetAnalyticsOverview :one
SELECT 
    COUNT(*) as total_applications,
    CAST(ROUND(
        CAST((COUNT(*) FILTER (WHERE status = 'pending')::float / 
         NULLIF(COUNT(*), 0)) * 100 AS numeric), 2
    ) AS float) as success_rate,
    COUNT(*) FILTER (WHERE sent_date >= CURRENT_DATE - INTERVAL '7 days') as applications_this_week
FROM applications 
WHERE user_id = $1;

-- name: GetAnalyticsTrends :many
SELECT 
    sent_date::text as date,
    COUNT(*) as count
FROM applications 
WHERE user_id = $1 
    AND sent_date >= $2 
    AND sent_date <= $3
GROUP BY sent_date 
ORDER BY sent_date;

-- name: GetAnalyticsCompanies :many
SELECT 
    company as name,
    COUNT(*) as applications,
    CAST(ROUND(
        CAST((COUNT(*) FILTER (WHERE status = 'pending')::float / 
         NULLIF(COUNT(*), 0)) * 100 AS numeric), 2
    ) AS float) as success_rate
FROM applications 
WHERE user_id = $1
GROUP BY company 
ORDER BY applications DESC 
LIMIT 10;

-- name: GetTopCompanyByUser :one
SELECT company
FROM applications 
WHERE user_id = $1
GROUP BY company 
ORDER BY COUNT(*) DESC 
LIMIT 1;



