# Neural And Accelerator Packages

## Summary

LogicN should support neural-network workloads through typed packages and target
planning, not by making neural networks part of normal app syntax.

Best rule:

```text
LogicN core defines the language.
logicn-core-vector defines vector, matrix and tensor shapes.
logicn-ai-neural defines neural network workloads.
logicn-ai-neuromorphic defines spike/event workloads.
logicn-core-compute selects targets and fallback plans.
target packages map planned work to CPU, GPU, AI accelerator or photonic plans.
```

## Package Split

```text
packages-logicn/logicn-core-vector
  Vector<T, N>, Matrix<T, R, C>, Tensor<T, Shape>, numeric element contracts

packages-logicn/logicn-ai-neural
  neural models, layers, activations, inference, training boundaries

packages-logicn/logicn-ai-neuromorphic
  Spike, SpikeTrain, EventSignal<T>, spiking models

packages-logicn/logicn-ai
  generic AI model metadata, safety policy and AI inference reports

packages-logicn/logicn-ai-lowbit
  low-bit, quantized and ternary AI backend contracts

packages-logicn/logicn-core-compute
  compute auto, target selection and fallback reports

packages-logicn/logicn-target-ai-accelerator
  NPU, TPU, AI-chip and passive accelerator backend profile planning

packages-logicn/logicn-target-photonic
  future photonic target planning
```

## Photonic And `-1`

`-1`, `0` and `+1` can appear in more than one LogicN package, but they do not mean
the same thing everywhere.

```text
logicn-core-logic
  Tri truth/logical state semantics

logicn-ai-lowbit
  ternary or low-bit model weights

logicn-core-photonic
  possible optical signal mappings for logic or compute states

logicn-target-photonic
  backend plans for photonic hardware or simulators
```

Photonic support should not own `Tri`. `Tri` belongs to `logicn-core-logic`. Photonic
packages can map logic states to optical properties such as phase, amplitude or
wavelength.

## Neural Workloads

Neural inference should be a typed compute workload:

```LogicN
secure compute flow moderateText(input: Text) -> Result<ModerationDecision, AiError> {
  compute auto {
    prefer ai_accelerator
    prefer gpu
    fallback cpu
  }

  let result: ClassificationResult = neural.infer("moderation-model", input)
  return policy.moderation.decide(result)
}
```

Neural output is untrusted by default. Confidence, classification and
distribution outputs are not `Bool` and must not directly authorize security,
payment or access-control decisions.

## Training Workloads

Training should be more constrained than inference because it can consume large
amounts of memory, storage, accelerator time and sensitive data.

Training plans must declare:

```text
dataset reference
data policy
loss function
optimizer
epochs
batch size
memory limit
timeout
target preference
fallback behavior
```

## Target Planning

Target selection should stay generic:

```text
compute auto
prefer ai_accelerator
prefer gpu
prefer low_bit_ai
fallback cpu
```

Do not make source syntax depend on one backend, chipset or vendor.

Vendor-specific AI accelerators should be backend profiles. For example, Intel
Gaudi 3 can be selected as `intel.gaudi3.hl338` under the generic
`ai_accelerator` target, but LogicN source should not need `target gaudi`.

The practical first implementation should generate controlled adapter plans for
existing AI ecosystems such as PyTorch, vLLM, Hugging Face, DeepSpeed,
TensorFlow or PyTorch Lightning before attempting native backend integration.

Reports should record:

```text
requested target
selected target
selected backend
fallback reason
model name
precision
memory limit
thread or accelerator limit
warnings
```

## Non-Goals

- Do not make LogicN core a neural-network framework.
- Do not make BitNet, Graphify, a GPU vendor or an AI accelerator vendor part of
  LogicN syntax.
- Do not require photonic, GPU or AI accelerator hardware for baseline LogicN.
- Do not let model output directly make high-impact decisions.
- Do not put neural layers or training policy into `logicn-core-vector`.

## Final Rule

```text
LogicN should be able to define, check, run, accelerate and report neural workloads.
It should do that through typed packages and target plans, not by turning the
core language into a neural-network framework.
```
