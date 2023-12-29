# react-native-caf-face-authenticator.podspec

require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-caf-face-authenticator"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-caf-face-authenticator
                   DESC
  s.homepage     = "https://github.com/github_account/react-native-caf-face-authenticator"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Your Name" => "yourname@email.com" }
  s.platforms    = { :ios => "12.0" }
  s.source       = { :git => "https://github.com/github_account/react-native-caf-face-authenticator.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,cc,cpp,m,mm,swift}"
  s.requires_arc = true
  s.dependency "FaceAuth", "3.1.11"
  s.dependency "React"
  # ...
  # s.dependency "..."
end

