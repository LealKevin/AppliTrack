FROM golang:latest

WORKDIR /app

RUN go install github.com/jackc/tern@latest
ENV PATH="/go/bin:$PATH"

COPY go.mod ./
COPY go.sum ./

RUN go mod download

COPY . .
COPY ./migrations /app/migrations

RUN go build -o main ./cmd/api/main.go

RUN chmod +x ./entrypoint.sh

CMD ["./entrypoint.sh"]

EXPOSE 8080
