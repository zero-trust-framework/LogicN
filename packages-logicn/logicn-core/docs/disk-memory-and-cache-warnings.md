# Disk, Memory and Cache Warnings

LogicN should use standard codes for disk, memory and cache health.

## Disk Warnings

```text
LogicN-WARN-DISK-001: Available disk space is low.
LogicN-WARN-DISK-002: Disk write speed is below expected threshold.
LogicN-WARN-DISK-003: Disk spill mode enabled due to memory pressure.
LogicN-ERR-DISK-001: Failed to write spill file.
LogicN-ERR-DISK-002: Failed to read spill file.
LogicN-FATAL-DISK-001: Disk unavailable and no safe memory fallback exists.
```

## Memory Warnings

```text
LogicN-WARN-MEM-001: Cached memory limit reached. Cache entry moved to general memory.
LogicN-WARN-MEM-002: General memory pressure detected.
LogicN-WARN-MEM-003: Memory spill to disk started.
LogicN-WARN-MEM-004: Memory checkpoint created due to risk threshold.
LogicN-ERR-MEM-001: Memory integrity check failed. Runtime restored previous checkpoint.
LogicN-ERR-MEM-002: Memory limit exceeded and recovery was required.
LogicN-FATAL-MEM-001: Memory corruption detected and recovery failed.
```

## Cache Warnings

```text
LogicN-WARN-CACHE-001: Cached function memory limit reached.
LogicN-WARN-CACHE-002: Cache entry demoted to general memory.
LogicN-WARN-CACHE-003: Cache entry spilled to disk.
LogicN-ERR-CACHE-001: Cache restore failed.
LogicN-ERR-CACHE-002: Cache checksum mismatch.
```

Cache warnings must not hide correctness failures. If a cache cannot be used safely, LogicN should compute without the cache where possible and report the recovery action.
