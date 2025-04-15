-- name: GetAllApplications :many
SELECT * FROM applications WHERE user_id = $1;

-- name: GetApplicationsByStatus :many
SELECT * FROM applications WHERE status = $1 AND user_id = $2 ORDER BY updated_at DESC, created_at DESC;

-- name: GetOneApplicationByID :one
SELECT * FROM applications WHERE id = $1;

-- name: DeleteOneApplicationByID :one
DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING *;

-- name: UpdateOneApplicationByID :one
UPDATE applications SET title_application = $1, company = $2, sent_date = $3, status = $4, notes = $5, url_application = $6 WHERE id = $7 AND user_id = $8 RETURNING *;

-- name: CreateOneApplication :one
INSERT INTO applications ( title_application, company, sent_date, status, notes, url_application, user_id ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;

-- name: GetAllUsers :many
SELECT * FROM users;

-- name: CreateUser :one
INSERT INTO users ( name, email, password ) VALUES ($1, $2, $3) RETURNING *;

-- name: GetOneUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: GetOneUserByID :one
SELECT * FROM users WHERE id = $1;



