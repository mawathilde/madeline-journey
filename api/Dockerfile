# syntax=docker/dockerfile:1

FROM golang:1.22.2-alpine

WORKDIR /app

COPY . .
RUN go mod download

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /madeline-journey-api

EXPOSE 8080

# Run
CMD ["/madeline-journey-api"]