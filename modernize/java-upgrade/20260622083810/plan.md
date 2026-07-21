# Upgrade Plan: examinsight-java (20260622083810)

- **Generated**: 2026-06-22 08:38:10 UTC
- **HEAD Branch**: N/A (Git not available)
- **HEAD Commit ID**: N/A (Git not available)

## Available Tools

**JDKs**
- JDK 17: N/A (not available - baseline will be skipped)
- JDK 25.0.3: C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot\bin (target version)
- JDK 26.0.1: C:\Program Files\Java\jdk-26.0.1\bin (non-LTS, not used)

**Build Tools**
- Maven 3.9.0+: **<TO_BE_INSTALLED>** (required for all steps)

## Guidelines

> Note: You can add any specific guidelines or constraints for the upgrade process here if needed, bullet points are preferred.

- Minimal disruption: Only essential changes for Java 25 compatibility
- Focus on compatibility, not modernization
- Preserve existing functionality and behavior

## Options

- Working branch: appmod/java-upgrade-20260622083810
- Run tests before and after the upgrade: true

## Upgrade Goals

- Upgrade Java from 17 to 25 (latest LTS)

## Technology Stack

| Technology/Dependency | Current | Min Compatible | Why Incompatible |
|-----------------------|---------|-----------------|------------------|
| Java                  | 17      | 25              | User requested   |
| Maven (build tool)    | N/A     | 3.9.0           | Required for Java 25 |
| pdfbox                | 3.0.1   | 3.0.1           | Compatible with Java 25 |
| postgresql            | 42.7.2  | 42.7.2          | Compatible with Java 25 |
| maven-compiler-plugin | N/A     | 3.11.0          | Recommended for Java 25 |

## Derived Upgrades

- **Maven to 3.9.0+**: Required for reliable Java 25 support. Maven 3.8.x is EOL and not recommended for Java 25.
- **maven-compiler-plugin to 3.11.0+**: Recommended for better Java 25 support and improved module system compatibility.

## Impact Analysis

### Subsection: Dependency Changes

| File | Dependency | Current | Action | Target | Reason |
|------|-----------|---------|--------|--------|--------|
| pom.xml | maven.compiler.source | 17 | upgrade | 25 | User requested |
| pom.xml | maven.compiler.target | 17 | upgrade | 25 | User requested |
| pom.xml | maven-compiler-plugin (implicit) | 3.8.x | upgrade | 3.11.0 | Recommended for Java 25 |

### Subsection: Source Code Changes

No source code changes required. The project uses standard Java APIs compatible with Java 25. Dependencies (pdfbox 3.0.1, postgresql 42.7.2) are compatible with Java 25.

### Subsection: Configuration Changes

No configuration file changes required. The project uses standard Maven properties that are compatible with Java 25.

### Subsection: CI/CD Changes

No CI/CD files detected in this project (no Dockerfile, azure-pipelines.yml, or similar).

### Subsection: Risks & Warnings

- **Reflection APIs**: The project does not appear to use internal JDK reflection APIs. No risk of InaccessibleObjectException.
- **Module system**: The project does not explicitly use Java modules (no module-info.java detected). Classpath mode will continue to work.
- **No baseline JDK**: Current JDK 17 is not available on this system. Baseline compilation/test step will be skipped. Ensure manual testing on Java 25 after upgrade.

## Upgrade Steps

- Step 1: Setup Environment
  - **Rationale**: Install Maven 3.9.0+ (required for Java 25 support) and verify Java 25 availability
  - **Changes to Make**: Install Maven 3.9.0+ via #appmod-install-maven
  - **Verification**: `mvn --version` should show Maven 3.9.0+ and Java 25.x; `javac -version` should show Java 25

- Step 2: Setup Baseline
  - **Rationale**: Establish baseline compilation and test results (SKIPPED - base JDK 17 not available)
  - **Changes to Make**: N/A
  - **Verification**: N/A

- Step 3: Upgrade Java Version to 25
  - **Rationale**: Update pom.xml compiler properties from 17 to 25, aligning with user's upgrade goal
  - **Changes to Make**: Update maven.compiler.source and maven.compiler.target properties from 17 to 25 in pom.xml
  - **Verification**: `mvn clean test-compile -DskipTests=true` should complete successfully with Java 25

- Step 4: Final Validation
  - **Rationale**: Verify all compilation and tests pass with Java 25
  - **Changes to Make**: None (verification only)
  - **Verification**: `mvn clean test` should pass all tests with 100% pass rate using Java 25

---

**Version Control Note**: Git is not available in this workspace. Changes will not be automatically committed. Manual backup recommended before execution.
