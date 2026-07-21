# Java Module Skeleton for ExamInsight

This folder is a placeholder for the Java component.

## Proposed Structure

```
java/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── edupath/
│   │   │           ├── Main.java              # Java application entry point
│   │   │           ├── parser/
│   │   │           │   └── PDFExtractUtility.java # Optional parser utilities for local execution
│   │   │           └── database/
│   │   │               └── JDBCConnection.java    # Shared DB persistence layers
│   │   └── resources/
│   └── test/
├── pom.xml                                    # Maven configuration (or build.gradle)
└── README.md                                  # This documentation
```

## Intended Purpose
- Provides high-performance parser utilities.
- Implements background indexing tasks.
- Interfaces with the database layer using JDBC/Hibernate where heavy transactional consistency or batch processing of data feeds is required.
