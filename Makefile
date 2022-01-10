# Dev task: Watch & build sources, host demo bundle at localhost:5000
dev:
	npm i && npm run dev

# Run basic tests
test: prettier lint

# Lint sources
lint:
	npm run lint

# Check that code style matches prettier configuration
prettier:
	npm run prettier:check

# Create production builds
build:
	npm i && npm run build

# Create a release
release:
	npm run release
