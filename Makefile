# Developer tasks for the NEX backend (nexd).
# Run `make help` to list available targets.

BINARY := nexd
PKG := ./...

.DEFAULT_GOAL := help
.PHONY: help build run test vet fmt tidy lint clean

# Show the available targets.
help:
	@echo "NEX backend — make targets:"
	@echo "  build   Compile the nexd binary into ./bin"
	@echo "  run     Run nexd from source"
	@echo "  test    Run all tests with the race detector"
	@echo "  vet     Run go vet"
	@echo "  fmt     Format all Go source with gofmt"
	@echo "  tidy    Reconcile go.mod / go.sum"
	@echo "  lint    Static checks (currently go vet)"
	@echo "  clean   Remove build artifacts"

# Compile the nexd binary into ./bin.
build:
	go build -o bin/$(BINARY) ./cmd/nexd

# Run nexd directly from source.
run:
	go run ./cmd/nexd

# Run the full test suite with the race detector enabled.
test:
	go test -race $(PKG)

# Report suspicious constructs.
vet:
	go vet $(PKG)

# Format all Go source in place.
fmt:
	gofmt -w .

# Reconcile module requirements.
tidy:
	go mod tidy

# Static analysis. Extend with golangci-lint when the project warrants it.
lint: vet

# Remove build artifacts.
clean:
	rm -rf bin
