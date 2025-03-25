-- name: GetAllApplications :many
SELECT * FROM applications;

-- name: GetOneApplicationByID :one
SELECT * FROM applications WHERE id = $1;

-- name: DeleteOneApplicationByID :one
DELETE FROM applications WHERE id = $1 RETURNING *;

-- name: CreateOneApplication :one
INSERT INTO applications ( title_application, company, sent_date, status, notes, url_application, user_id ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;

