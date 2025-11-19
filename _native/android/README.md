# YoRight Android App

## Setup (Future)

This directory will contain the native Android app built with:

- **Language**: Kotlin 1.9+
- **UI**: Jetpack Compose
- **Architecture**: MVVM + Clean Architecture
- **Networking**: Generated from OpenAPI spec
- **Build**: Gradle (Kotlin DSL)

## Prerequisites

- Android Studio Hedgehog+
- Min SDK: 24 (Android 7.0)
- Target SDK: 34 (Android 14)

## Generated SDK

The API client will be auto-generated from `/openapi.json`:

```bash
# From project root
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:5000/openapi.json \
  -g kotlin \
  -o _native/android/yoright-sdk
```

## Project Structure (Planned)

```
app/
├── src/
│   ├── main/
│   │   ├── java/com/yoright/
│   │   │   ├── ui/
│   │   │   │   ├── search/
│   │   │   │   ├── hotels/
│   │   │   │   └── booking/
│   │   │   ├── data/
│   │   │   │   ├── api/      # Generated SDK
│   │   │   │   ├── models/
│   │   │   │   └── repository/
│   │   │   ├── domain/
│   │   │   └── di/
│   │   ├── res/
│   │   │   ├── values/       # English
│   │   │   ├── values-ar/    # Arabic (RTL)
│   │   │   └── drawable/
│   │   └── AndroidManifest.xml
│   └── test/
└── build.gradle.kts
```

## Design Tokens

Import design tokens from `/packages/design-tokens/`:

```kotlin
object YoRightColors {
    val Primary = Color(0xFF0F4C5C)
    val Secondary = Color(0xFFE8B449)
    val Accent = Color(0xFFD4AF37)
}
```

## RTL Support

- Set `supportsRtl="true"` in manifest
- Use `start`/`end` instead of `left`/`right`
- Test with Arabic locale
- Use Arabic numerals in formatters

## Security (MASVS Compliance)

- No secrets in code
- Encrypted SharedPreferences
- Certificate pinning
- Root detection
- ProGuard/R8 obfuscation

## Dependencies (Planned)

```kotlin
dependencies {
    // Compose
    implementation("androidx.compose.ui:ui:1.5.4")
    implementation("androidx.compose.material3:material3:1.1.2")
    
    // Networking
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    
    // DI
    implementation("com.google.dagger:hilt-android:2.48")
    
    // Navigation
    implementation("androidx.navigation:navigation-compose:2.7.5")
}
```

## Next Steps

1. Create Android Studio project
2. Generate Kotlin SDK from OpenAPI
3. Import design tokens
4. Set up Hilt for DI
5. Implement authentication flow
6. Build hotel search and booking
