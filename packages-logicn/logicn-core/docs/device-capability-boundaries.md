# LogicN Device Capability Boundaries

Status: Draft.

This document defines what LogicN should support as a programming language for
phone, tablet, desktop and embedded device capabilities.

LogicN should stay a programming language and compiler/toolchain. It should not
become a mobile framework, operating system, media framework, camera API,
database, CMS, search engine or AI platform.

Modern devices may contain:

```text
CPU
GPU
NPU / AI accelerator
ISP image signal processor
DSP audio processor
modem
storage controller
secure enclave / trusted execution hardware
camera hardware
display hardware
audio hardware
sensors
wireless chips
```

LogicN should provide the safe, strict, typed foundation that allows developers,
libraries, runtimes, drivers and frameworks to use those systems correctly.

---

## Core Rule

```text
LogicN supports the safe foundations for device features.
LogicN does not directly provide the phone features themselves.
```

LogicN core should provide:

```text
types
memory safety
modules
imports
permissions model
error handling
async/event model
streams
buffers
binary data
compute targeting
capability detection
security reporting
FFI/native bindings
compile outputs
debug metadata
```

Libraries should provide:

```text
camera access
microphone access
photo decoding
video decoding
audio processing
Bluetooth
GPS/location
sensors
notifications
database clients
AI model runners
file pickers
mobile UI integration
network protocols
```

Frameworks should provide:

```text
mobile app structure
screens
routing
navigation
state management
UI components
forms
platform lifecycle
app packaging
deployment to app stores
```

---

## Native LogicN Support

LogicN should support normal program execution:

```text
flows/functions
modules
imports
strict typing
safe memory
error handling
async tasks
concurrency
compile targets
runtime configuration
```

Example:

```LogicN
use app
use security
use compute

flow main() -> Result<Void, AppError> {
  return app.start()
}
```

---

## Portable Data Types

LogicN should support built-in types that are useful across platforms:

```text
Int
Float
Decimal
String
Bool
Tri
Bytes
Array<T>
Map<K, V>
Json
Result<T, E>
Option<T>
Error
DateTime
Duration
```

For device-related work, the important language-level values are not native
`Camera` or `FMRadio` primitives. The useful portable primitives are:

```text
Bytes
Buffer<T>
Stream<T>
ImageData
AudioData
SignalData
Tensor<T>
Vector<T>
Matrix<T>
Json
BinaryData
```

Some of these may begin as standard-library or package-defined types, but the
language should make them memory-safe, typed and reportable.

---

## Memory-Safe Buffers

Devices handle large binary data:

```text
photos
audio
video
network packets
encrypted messages
sensor streams
AI tensors
```

LogicN should support safe binary buffers and views.

Example:

```LogicN
let imageBytes: Bytes = file.readBytes("photo.jpg")
let audioBuffer: Buffer<AudioSample> = audio.decode(input)
```

The language should prevent:

```text
buffer overflow
out-of-bounds access
use-after-free
accidental mutation of shared data
unsafe aliasing across async tasks
unsafe native buffer ownership
```

---

## Streams

Many device features are streams:

```text
camera preview
microphone input
speaker output
video playback
network download
Bluetooth data
GPS updates
sensor readings
```

LogicN should support a safe stream model.

Example direction:

```LogicN
let frames: Stream<ImageFrame> = camera.preview()
let samples: Stream<AudioSample> = microphone.listen()
```

`camera.preview()` and `microphone.listen()` must come from libraries or
platform bindings, not core LogicN. LogicN provides the safe `Stream<T>` model,
backpressure rules, cancellation rules and diagnostics.

---

## Async and Events

Device applications are event-heavy:

```text
button tapped
screen rotated
network changed
photo captured
file downloaded
Bluetooth connected
permission granted
permission denied
```

LogicN should support explicit async/event handling without becoming a UI framework.

Example direction:

```LogicN
async flow handleSaveClick() -> Result<Void, SaveError>
effects [file.write] {
  let result = await savePhoto()
  return result
}
```

UI event binding should come from a UI framework or package. LogicN should provide
the language model for async, effects, cancellation, timeout and error handling.

---

## Compute Targets

Modern devices are not only CPUs. LogicN should describe where work may run:

```text
CPU
GPU
NPU
AI accelerator
DSP
photonic accelerator
WASM
server binary
mobile native target
```

Example:

```LogicN
compute auto flow analyseImage(input: ImageData) -> Result<ImageResult, ImageError> {
  return detectObjects(input)
}
```

The compiler/runtime may choose:

```text
CPU if no accelerator is available
GPU for parallel image work
NPU for AI inference
DSP for audio signal work
safe accelerator when available
safe fallback when unsupported
```

Compute target selection must be reportable and must not silently change
security, precision or correctness expectations.

---

## Capability Detection

LogicN should support safe hardware/runtime capability detection through toolchain or
runtime APIs.

Example direction:

```LogicN
let caps = system.capabilities()

if caps.supports("gpu.compute") {
  compute use gpu
} else {
  compute use cpu
}
```

Capability detection keeps LogicN portable without hard-coding one phone brand,
operating system or chip.

---

## Permissions

Device features often need permissions:

```text
camera
microphone
location
contacts
files
Bluetooth
notifications
network
photos
```

LogicN should support permission-aware programming.

Example direction:

```LogicN
requires permission camera

flow captureProfilePhoto() -> Result<ImageData, CaptureError>
effects [camera.read] {
  let photo = camera.capture()
  return Ok(photo)
}
```

The language does not provide the camera. The camera package/platform binding
does. LogicN makes permission requirements, effects and reports visible.

---

## External Interfaces

LogicN should support safe calls into platform libraries:

```text
Android APIs
iOS APIs
Linux APIs
Windows APIs
macOS APIs
C libraries
systems libraries
WebAssembly modules
device drivers
vendor SDKs
```

Example direction:

```LogicN
use platform.android.camera
use platform.ios.photos
use platform.linux.audio
```

Unsafe/native calls must be explicit:

```LogicN
unsafe external androidCameraCapture() -> NativeImage
effects [camera.read, native.call]
```

Kernel modules, operating-system drivers, privileged device access and raw
hardware access remain blocked by default and permission-gated by the existing
kernel/driver boundary rules.

---

## Security Reports

Device applications can handle private data. LogicN should report device-facing
permissions and risky boundaries.

Recommended reports:

```text
security-report.json
permissions-report.json
native-bindings-report.json
compute-target-report.json
device-capability-report.json
device-privacy-report.json
```

Reports should include:

```text
camera permission use
microphone permission use
location permission use
file access
network access
native unsafe calls
encryption use
external SDKs
AI model inference
compute target fallback
hardware capability assumptions
```

---

## Non-Native Device Features

LogicN should not directly include built-in language features for:

```text
camera app
photo gallery
video editor
music player
FM radio
Bluetooth stack
mobile notifications
contacts
maps
GPS navigation
mobile UI components
database engine
search engine
CMS
AI platform
social login
payment gateway
advertising SDK
```

Avoid core language functions like:

```LogicN
takePhoto()
playMusic()
scanBluetooth()
openGoogleMaps()
editVideo()
sendPushNotification()
```

Those are package/framework/platform API functions, not language primitives.

---

## Package Areas

LogicN can have official or community packages for platform features:

```text
LogicN.camera
LogicN.audio
LogicN.image
LogicN.video
LogicN.bluetooth
LogicN.location
LogicN.files
LogicN.sensors
LogicN.network
LogicN.notifications
LogicN.crypto
LogicN.ai
LogicN.compute
```

Example:

```LogicN
use LogicN.camera
use LogicN.image
use LogicN.compute

requires permission camera

flow analyseCameraFrame() -> Result<ImageAnalysis, CameraError>
effects [camera.read] {
  let frame = camera.captureFrame()
  let result = compute auto image.detectObjects(frame)
  return Ok(result)
}
```

The language supports:

```text
strict types
permissions
safe memory
compute auto
error handling
imports
Result handling
reports
```

The package supports:

```text
camera access
image detection
platform-specific implementation
```

---

## Phone Capability Classification

| Phone capability | Should LogicN core support it? | Where it belongs |
|---|---:|---|
| CPU execution | Yes | Compiler/runtime |
| GPU compute | Yes, as target support | Compiler/runtime + backend |
| NPU / AI accelerator | Yes, as target support | Compiler/runtime + backend |
| DSP audio compute | Maybe as target support | Backend/library |
| Camera | No | Library/platform binding |
| Photos | No | Library/platform binding |
| Audio playback | No | Library |
| Microphone | No | Library/platform binding |
| FM radio | No | Library/platform binding |
| Mobile data / modem | No | OS/platform API |
| Wi-Fi | No | OS/platform API |
| Bluetooth | No | Library/platform binding |
| GPS/location | No | Library/platform binding |
| Sensors | No | Library/platform binding |
| Files | Basic file API only | Standard library |
| Encryption | Basic crypto interfaces | Standard library/library |
| UI screens | No | Framework |
| Notifications | No | Framework/library |
| App store packaging | No | Tooling/framework |

---

## Suggested Position

```text
LogicN is a strict, memory-safe, security-first programming language that can
compile to multiple compute targets. It does not replace mobile frameworks or
operating-system APIs, but it provides safe types, permissions, compute
targeting, streams, buffers and native bindings so libraries can use device
capabilities securely.
```
