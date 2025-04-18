# Clear package andorid
./gradlew clean
# build package andorid
./gradlew build

## reset project
npm start -- --reset-cache

## export file .apk
./gradlew assembleRelease
## location export
android\app\build\outputs\apk\release\app-release.apk

## export file .aab
./gradlew bundleRelease
## location export
android/app/build/outputs/bundle/release/app-release.aab
