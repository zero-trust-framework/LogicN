# LogicN Neuromorphic

`logicn-ai-neuromorphic` is the package for neuromorphic and spiking event model
contracts.

It belongs in:

```text
/packages-logicn/logicn-ai-neuromorphic
```

Use this package for:

```text
Spike
SpikeTrain
EventSignal<T>
SpikingModel
NeuromorphicPlan
neuromorphic reports
event-driven inference plans
```

## Boundary

Neuromorphic support is related to neural computing, but it is not the same as
normal tensor neural networks.

```text
logicn-ai-neural
  tensors, weights, layers, inference, training

logicn-ai-neuromorphic
  spikes, events, event-driven spiking models
```

`logicn-ai-neuromorphic` should consume compute target planning from `logicn-core-compute` and
target output planning from future accelerator packages. It must not own normal
neural-network layer definitions or LogicN core syntax.

Final rule:

```text
logicn-ai-neuromorphic owns spiking/event concepts.
logicn-ai-neural owns tensor neural network concepts.
target packages own hardware-specific plans.
```
