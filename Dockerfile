FROM golang:latest

WORKDIR /app

RUN go install github.com/jackc/tern@latest
ENV PATH="/go/bin:$PATH"

COPY go.mod ./
COPY go.sum ./

RUN go mod download

COPY . .

RUN go build -o main main.go

RUN chmod +x ./entrypoint.sh

CMD sh -c "tern migrate -d /app/migrations && ./main"

EXPOSE 8080
