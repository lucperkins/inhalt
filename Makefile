.PHONY: coverage
coverage:
	npm run coverage
	open coverage/index.html

.PHONY: fix
fix:
	npm run fix

.PHONY: test
test: fix
	npm run test

.PHONY: watch-test
watch-test:
	npm run watch:test
