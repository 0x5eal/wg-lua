@ECHO OFF

rem Check if lune is installed
where lune > NUL 2>&1 (
  rem Get lune version
  FOR /F "tokens=2 delims=' ' " %%a IN ('lune --version') DO SET lune_version=%%a
  rem Check if version is greater than or equal to 8 using substring comparison
  IF "%lune_version:~-1%" GEQ 8 (
    rem CUSTOM EXAMPLE RUNNER BEGIN
    IF "%~1%"=="example" (
      SET filename=%~2%
      IF "%filename%"=="" (
        ECHO. Usage: %0 example <example_name> [ARGS]
        EXIT /B 1
      )
      SHIFT 2
      lune run "examples\%filename%.luau" %*
      EXIT /B %ERRORLEVEL%
    )
    rem CUSTOM EXAMPLE RUNNER END

    IF EXIST "%1*" (lune run %*) ELSE IF EXIST ".lune\%1*" (lune run %*)
  ) ELSE (
    lune %*
  )
)

EXIT /B %ERRORLEVEL%
