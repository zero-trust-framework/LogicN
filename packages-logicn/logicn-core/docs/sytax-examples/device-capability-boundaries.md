# Device Capability Boundary Examples

Status: Draft.

These examples show how LogicN should support safe foundations for device features
without making camera, radio, media, maps or mobile UI features native language
primitives.

---

## Good Examples

Camera package with explicit permission:

```LogicN
use LogicN.camera
use LogicN.image
use LogicN.compute

requires permission camera

type PhotoAnalysis {
  width: Int
  height: Int
  objects: Array<DetectedObject>
  confidence: Float
}

compute auto flow analysePhoto(photo: ImageData) -> Result<PhotoAnalysis, ImageError> {
  let objects = image.detectObjects(photo)

  return Ok(PhotoAnalysis {
    width: photo.width,
    height: photo.height,
    objects: objects,
    confidence: objects.averageConfidence()
  })
}

flow main() -> Result<Void, AppError>
effects [camera.read] {
  let permission = permissions.request(camera)

  match permission {
    Granted => {
      let photo = camera.capture()
      let result = analysePhoto(photo)
      console.log(result)
      return Ok()
    }

    Denied => {
      return Err(AppError.PermissionDenied("Camera permission denied"))
    }

    Unknown => {
      return Err(AppError.PermissionUnknown("Camera permission unknown"))
    }
  }
}
```

Sensor stream through a package:

```LogicN
use LogicN.sensors

requires permission sensors

flow readMotion(samples: Stream<MotionSample>) -> Result<MotionSummary, SensorError> {
  return sensors.summarise(samples)
}
```

Audio compute with safe fallback:

```LogicN
compute auto flow denoiseAudio(input: Buffer<AudioSample>) -> Result<Buffer<AudioSample>, AudioError> {
  return audio.denoise(input)
}
```

Native binding made explicit:

```LogicN
unsafe external platformRadioStatus() -> NativeRadioStatus
effects [native.call]
```

---

## Bad Examples

Built-in camera function:

```LogicN
flow profilePhoto() -> ImageData {
  return takePhoto()
}
```

Expected diagnostic:

```text
device_feature_not_core_language
```

Reason:

```text
Camera access must come from a package/platform binding with explicit
permissions and effects.
```

---

Camera package without permission:

```LogicN
use LogicN.camera

flow profilePhoto() -> Result<ImageData, CameraError>
effects [camera.read] {
  return Ok(camera.capture())
}
```

Expected diagnostic:

```text
missing_device_permission
```

Reason:

```text
camera.read requires an explicit camera permission declaration.
```

---

Native device access without unsafe marker:

```LogicN
external rawBluetoothScan() -> NativeBluetoothScan
effects [bluetooth.read, native.call]
```

Expected diagnostic:

```text
native_device_boundary_requires_unsafe
```

Reason:

```text
Native/platform device calls must be explicit unsafe boundaries.
```

---

Core mobile UI syntax:

```LogicN
screen ContactList {
  contacts.showAll()
}
```

Expected diagnostic:

```text
mobile_framework_syntax_not_core_language
```

Reason:

```text
Screens, navigation and mobile UI components belong in frameworks/packages, not
core LogicN.
```

---

Silent notification helper:

```LogicN
flow remindUser() -> Void {
  sendPushNotification("Hello")
}
```

Expected diagnostic:

```text
notification_feature_not_core_language
```

Reason:

```text
Notifications belong in framework/library/platform packages with explicit
permissions and runtime policy.
```

---

## Expected Reports

```text
device-capability-report.json
device-privacy-report.json
permissions-report.json
native-bindings-report.json
compute-target-report.json
```

Reports should explain:

```text
which device permissions are declared
which device effects are used
which packages/platform bindings provide device features
which unsafe native calls exist
which Stream<T> and Buffer<T> values cross boundaries
which compute targets and fallbacks are used
which generated locations map back to .lln source
```

