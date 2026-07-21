# Upgrade Plan: examinsight-java (20260621061231)

- **Generated**: 2026-06-21 06:12:31
- **HEAD Branch**: N/A
- **HEAD Commit ID**: N/A

## Available Tools

**JDKs**
- JDK 25: C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot\bin\java.exe (available, used by Steps 2-4)
- JDK 17: not available (baseline skipped)

**Build Tools**
- Apache Maven: **<TO_BE_INSTALLED>** (required by Steps 1-4)

## Guidelines

- Upgrade the Java runtime target to the latest LTS version available in the environment.
- Preserve the existing Maven project structure and direct dependencies.
- Do not introduce framework or runtime changes beyond Java source/target update.

> Note: You can add any specific guidelines or constraints for the upgrade process here if needed, bullet points are preferred.

## Options

- Working branch: appmod/java-upgrade-20260621061231
- Run tests before and after the upgrade: true

## Upgrade Goals

- Java runtime and compilation target: 25

## Technology Stack

| Technology/Dependency | Current | Min Compatible | Why Incompatible |
| --------------------- | ------- | -------------- | ---------------- |
| Java | 17 | 25 | User requested latest LTS runtime upgrade |
| Maven compiler properties | 17 | 25 | Must match upgraded runtime target |
| Apache PDFBox | 3.0.1 | 3.0.1 | Current version already supports newer Java versions |
| PostgreSQL JDBC driver | 42.7.2 | 42.7.2 | Current version is compatible; no upgrade required unless CVE fix is needed |

## Derived Upgrades

- Java 25 → Maven 3.9+ recommended for current JDK support and build stability.
- No Kotlin or Spring Boot present; direct Java source/target update is sufficient.

## Impact Analysis

### Dependency Changes

| File | Dependency | Current | Action | Target | Reason |
|------|------------|---------|--------|--------|--------|
| java/pom.xml | maven.compiler.source | 17 | upgrade | 25 | User requested latest LTS Java runtime |
| java/pom.xml | maven.compiler.target | 17 | upgrade | 25 | User requested latest LTS Java runtime |

### Source Code Changes

| File | Location | Current | Required Change | Reason |
|------|----------|---------|----------------|--------|
| None | N/A | N/A | N/A | Existing source is compatible with the Java language upgrade; no code changes required unless CVE fix triggers dependency updates. |

### Configuration Changes

| File | Property/Setting | Current | Required Change | Reason |
|------|------------------|---------|----------------|--------|
| None | N/A | N/A | N/A | No application configuration properties require change for a Java source/target bump. |

### CI/CD Changes

| File | Location | Current | Required Change |
|------|----------|---------|----------------|
| None | N/A | N/A | N/A |

### Risks & Warnings

- **Build tool unavailable locally**: Maven is not installed and no Maven wrapper exists, so the upgrade requires installing Maven before any compile or test verification.
- **Baseline compile skipped**: The original Java 17 runtime/baseline environment is not available, so we cannot verify the pre-upgrade build under the exact original JDK.
- **CVE scan required**: Direct dependencies should be scanned for security issues after the upgrade, and any reported CVEs must be fixed by patch-level version bumps.

## Upgrade Steps

- Step 1: Install Apache Maven
  - **Rationale**: The Java module has no Maven wrapper and `mvn` is not installed locally, so a build tool is required before any upgrade verification.
  - **Changes to Make**: Install Maven 3.9+ and make it available to the session.
  - **Verification**: `mvn -version` with JDK 25, expected success.

- Step 2: Update Java compilation target to 25
  - **Rationale**: This is the core runtime upgrade and must be applied in the Maven POM to use the latest LTS JDK.
  - **Changes to Make**: Update `maven.compiler.source` and `maven.compiler.target` from 17 to 25 in `java/pom.xml`.
  - **Verification**: `mvn -q clean test-compile` with JDK 25, expected success.

- Step 3: CVE validation and fix
  - **Rationale**: Ensure the upgraded project has no known CVEs in direct dependencies before final validation.
  - **Changes to Make**: Run direct dependency scan and apply patch-level upgrades if vulnerabilities are reported.
  - **Verification**: `mvn -q clean test-compile` with JDK 25 after any fixes.

- Step 4: Final validation
  - **Rationale**: Confirm the project builds and tests successfully under Java 25, completing the upgrade.
  - **Changes to Make**: Address any remaining compilation or test failures from prior steps.
  - **Verification**: `mvn -q clean test` with JDK 25, expected success.
