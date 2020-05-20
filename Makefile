TAG 				     := $(shell git describe --tags)
M                = $(shell printf "\033[34;1m>>\033[0m")

.PHONY: all
all: setup build

.PHONY: build
build: setup build-integration build-checkout build-web

.PHONY: setup
setup: ; $(info $(M) setting up dependencies...)
	@yarn install

.PHONY: build-integration
build-integration: ; $(info $(M) building integration scripts...)
	cd checkout && TAG=$(TAG) npm run integration:production

.PHONY: build-checkout
build-checkout: ; $(info $(M) building checkout...)
	cd checkout && TAG=$(TAG) npm run checkout:production

.PHONY: build-web
build-web: ; $(info $(M) building web...)
	cd web && TAG=$(TAG) npm run web:production
	cd web npm run web:main

.PHONY: build-ui-kit
build-ui-kit: ; $(info $(M) building ui-kit...)
	cd ui-kit && TAG=$(TAG) npm run build
