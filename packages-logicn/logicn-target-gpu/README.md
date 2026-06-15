# LogicN Target GPU

`logicn-target-gpu` is the package for GPU target planning and output contracts.

It belongs in:

```text
/packages-logicn/logicn-target-gpu
```

Use this package for:

```text
GPU target metadata
GPU plan output
kernel mapping plans
precision and tolerance reports
data movement reports
GPU fallback reports
future CUDA/ROCm/WebGPU/Vulkan planning
```

## Boundary

`logicn-target-gpu` should consume compute plans from `logicn-core-compute` and produce
GPU-specific target plans or reports. It should not own vector semantics,
compute target selection or application runtime policy.

Final rule:

```text
logicn-core-vector defines vector operations.
logicn-core-compute chooses and plans compute targets.
logicn-target-gpu maps suitable work to GPU plans or outputs.
```
