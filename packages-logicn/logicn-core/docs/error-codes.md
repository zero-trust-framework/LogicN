# Error Codes

This document indexes the first planned LogicN diagnostic code ranges.

## Ranges

```text
LogicN-WARN-MEM-*      memory warnings
LogicN-ERR-MEM-*       recoverable memory errors
LogicN-FATAL-MEM-*     unrecoverable memory errors
LogicN-WARN-DISK-*     disk warnings
LogicN-ERR-DISK-*      disk errors
LogicN-FATAL-DISK-*    unrecoverable disk errors
LogicN-WARN-CACHE-*    cache warnings
LogicN-ERR-CACHE-*     cache errors
LogicN-WARN-LOGIC-*    logic-width warnings
LogicN-ERR-LOGIC-*     logic-width errors
LogicN-WARN-TARGET-*   target support warnings
LogicN-ERR-TARGET-*    target support errors
```

## Core Codes

```text
LogicN-WARN-MEM-001: Cached memory limit reached. Cache entry moved to general memory.
LogicN-ERR-MEM-001: Memory integrity check failed. Runtime restored previous checkpoint.
LogicN-FATAL-MEM-001: Memory corruption detected and recovery failed.
LogicN-WARN-DISK-001: Available disk space is low.
LogicN-ERR-DISK-001: Failed to write spill file.
LogicN-FATAL-DISK-001: Disk unavailable and no safe memory fallback exists.
LogicN-WARN-LOGIC-001: Target does not natively support requested logic width. Using simulation.
LogicN-ERR-LOGIC-001: Requested logic width is unsupported by selected target.
LogicN-WARN-TARGET-003: Accelerator target unavailable. Falling back to CPU.
LogicN-ERR-TARGET-001: Selected target is not installed.
```

## Prototype Codes

The current prototype emits these standardised codes for implemented checks:

```text
LogicN-ERR-TARGET-002
LogicN-WARN-TARGET-003
LogicN-WARN-LOGIC-001
LogicN-ERR-LOGIC-001
LogicN-WARN-DISK-003
LogicN-ERR-DISK-001
LogicN-WARN-MEM-002
LogicN-WARN-MEM-005
LogicN-ERR-MEM-006
LogicN-ERR-TYPE-001
LogicN-ERR-TYPE-002
LogicN-ERR-TYPE-003
LogicN-ERR-NULL-001
LogicN-ERR-NULL-002
LogicN-WARN-BUILD-002
LogicN-ERR-SEC-001
LogicN-WARN-SEC-002
LogicN-WARN-API-001
```
