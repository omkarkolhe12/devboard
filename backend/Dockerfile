FROM golang:1.22-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /devboard-backend .

FROM alpine:3.20
RUN adduser -D -u 10001 app
COPY --from=build /devboard-backend /usr/local/bin/devboard-backend
USER app
EXPOSE 8080
ENTRYPOINT ["devboard-backend"]
