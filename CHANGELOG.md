# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## 0.3.0 (2015-06-15)

### Added

- Throws TypeError if invalid `repo` config by @dasilvacontin.
- Throw Error if couldn't figure out `repo` by @dasilvacontin.

## 0.2.0 (2015-06-14)

### Added

- Parse existing link summary and merge it with new data by [@dasilvacontin].
- Config for issue links by [@dasilvacontin].

### Changed

- Single newline instead of double at EOF by [@dasilvacontin].
- Default file for CLI is only CHANGELOG.md, no more README.md by [@dasilvacontin].

### Fixed

- Parse issues between parenthesis by [@dasilvacontin].
- Don't overwrite old urls by [@dasilvacontin].
- Don't change text (whitespace at end) when there are no enhancements by [@dasilvacontin].

## 0.1.0 (2015-06-13)

### Added

- Throw TypeError if wrong type for `text` argument by [@dasilvacontin].
- Multiple unit tests for `sauce#dress` by [@dasilvacontin].
- Username/issue parsing with markdown link generation by [@dasilvacontin].
- Basic CLI by [@dasilvacontin].

The markdown links in this change log were generated using `gh-sauce`.

[@dasilvacontin]: https://github.com/dasilvacontin
