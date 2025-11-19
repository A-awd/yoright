# YoRight iOS App

## Setup (Future)

This directory will contain the native iOS app built with:

- **Language**: Swift 5.9+
- **UI**: SwiftUI
- **Architecture**: MVVM + Clean Architecture
- **Networking**: Generated from OpenAPI spec
- **Package Manager**: Swift Package Manager

## Prerequisites

- Xcode 15+
- iOS 15+ deployment target
- CocoaPods or SPM

## Generated SDK

The API client will be auto-generated from `/openapi.json`:

```bash
# From project root
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:5000/openapi.json \
  -g swift5 \
  -o _native/ios/YoRightSDK
```

## Project Structure (Planned)

```
YoRight/
├── App/
│   ├── YoRightApp.swift
│   └── ContentView.swift
├── Features/
│   ├── Search/
│   ├── Hotels/
│   ├── Booking/
│   └── Profile/
├── Core/
│   ├── API/          # Generated SDK
│   ├── Models/
│   └── Utils/
├── Resources/
│   ├── Assets.xcassets
│   └── Localizable.strings (ar, en)
└── Tests/
```

## Design Tokens

Import design tokens from `/packages/design-tokens/`:

```swift
struct YoRightColors {
    static let primary = Color(hex: "#0F4C5C")
    static let secondary = Color(hex: "#E8B449")
    static let accent = Color(hex: "#D4AF37")
}
```

## RTL Support

- Set semantic content attributes
- Use leading/trailing instead of left/right
- Test with Arabic locale
- Use Arabic numerals in formatters

## Security (MASVS Compliance)

- No secrets in code
- Keychain for tokens
- Certificate pinning
- Jailbreak detection
- App Transport Security

## Next Steps

1. Create Xcode project
2. Generate Swift SDK from OpenAPI
3. Import design tokens
4. Implement authentication flow
5. Build hotel search and booking
