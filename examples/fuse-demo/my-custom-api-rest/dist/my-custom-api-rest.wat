(module
  (memory 2 2048)
  (export "memory" (memory 0))

  ;; pure flow: main
  (func $main (result i32)
    (i32.const 200)
  )
  (export "main" (func $main))

)