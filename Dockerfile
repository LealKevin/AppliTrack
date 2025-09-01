FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main ./cmd/api/main.go

FROM alpine:3.18

RUN apk add --no-cache ca-certificates postgresql-client && \
    adduser -D -s /bin/sh appuser

WORKDIR /go
RUN wget https://github.com/jackc/tern/releases/download/v2.3.2/tern_2.3.2_linux_amd64.tar.gz && \
    tar -xzf tern_2.3.2_linux_amd64.tar.gz && \
    mv tern /usr/local/bin/ && \
    rm tern_2.3.2_linux_amd64.tar.gz

WORKDIR /app

COPY --from=builder /app/main .
COPY --from=builder /app/entrypoint.sh .
COPY --from=builder /app/migrations ./migrations

RUN chmod +x ./entrypoint.sh && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8080

CMD ["./entrypoint.sh"]
