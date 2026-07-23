---
slug: claude-code-install-errors
title: 클로드코드(Claude Code) 설치 시 발생하는 오류와 해결법 정리
excerpt: >-
  Claude Code 설치 오류를 OS별로 정리한 FAQ형 가이드입니다. macOS, Windows, WSL과 리눅스, 공통 케이스로 나눠
  각 오류 문구의 상황, 원인, 대응법을 세트로 정리했습니다.
category: AI_TECH
tags:
  - AI
  - 바이브코딩
  - 자동화
publishedAt: '2026-07-21T00:00:00.000Z'
updatedAt: '2026-07-23T00:00:00.000Z'
highlights:
  - >-
    화면에 뜬 오류 문구를 그대로 찾아 해당 케이스의 대응법만 따라 하면 됩니다. 원인을 모른 채 재설치를 반복하는 것이 시간을 가장 많이
    씁니다.
  - npm 관련 오류가 반복되면 Node.js가 필요 없는 네이티브 설치 한 줄로 갈아타는 것이 가장 빠른 해결입니다.
metaTitle: 클로드코드(Claude Code) 설치 시 발생하는 오류와 해결법 정리 (2026)
metaDescription: >-
  Claude Code 설치 오류를 OS별 FAQ로 정리했습니다. command not found, Node 버전, PowerShell 명령
  혼동, Git 오류, EACCES 권한, WSL 문제까지 오류 문구별 상황, 원인, 대응법을 안내합니다.
ogTitle: 클로드코드 설치 시 발생하는 오류와 해결법
ogDescription: 'macOS, Windows, WSL별로 나눈 설치 오류 FAQ. 오류 문구마다 상황, 원인, 대응법을 세트로 정리했습니다.'
ogImage: /og/claude-code-install-errors.png
quiz:
  - question: '설치가 끝났는데 터미널에 command not found: claude가 뜹니다. 가장 가능성이 높은 원인은 무엇일까요?'
    options:
      - 설치 위치가 셸의 PATH 목록에 등록되지 않아서 셸이 프로그램을 못 찾는 상태다
      - 설치가 실패해서 프로그램 파일 자체가 없는 상태다
      - 인터넷 연결이 끊겨서 실행이 차단된 상태다
    correctIndex: 0
    explanation: >-
      이 오류의 대부분은 설치 실패가 아니라 PATH 문제입니다. 프로그램은 ~/.local/bin에 설치돼 있지만 셸이 그 위치를 검색
      목록에 갖고 있지 않은 상태라서, PATH에 한 줄 추가하면 해결됩니다.
---

Claude Code 설치 중 만나는 오류를 OS별로 정리했습니다. 화면에 뜬 오류 문구로 케이스를 찾아 대응법을 따라 하면 됩니다. 대응법에 자주 등장하는 "네이티브 설치"는 아래 한 줄 명령을 말하며, Node.js와 Git이 없어도 됩니다.

![2026년 기준 Claude Code 공식 권장 설치 방법 도판. macOS와 리눅스, WSL은 curl 한 줄, Windows는 PowerShell에서 irm 한 줄이며, 막힐 때의 대안으로 Homebrew와 WinGet 명령이 정리됨](/images/insights/claude-code-install-errors/ko-install-methods.png)

## macOS에서 클로드코드 설치 시 발생하는 오류와 해결법

### "zsh: command not found: claude"

- **상황**: 설치가 끝났다고 나왔는데 `claude` 입력 시 이 문구 발생
- **원인**: 설치 실패가 아니라 PATH 문제. 프로그램은 `~/.local/bin`에 설치됐지만, 셸이 프로그램을 찾아보는 폴더 주소록(PATH)에 이 위치가 미등록
- **대응법**: 주소록에 설치 위치를 추가하고 설정을 다시 읽음

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

`claude --version`이 버전 번호를 출력하면 해결된 것입니다. VS Code 확장만 설치한 경우에는 터미널용 claude가 아예 없는 상태이므로, 네이티브 설치를 먼저 실행합니다.

![설치했는데 command not found가 뜨는 이유를 설명하는 도판. 터미널에 claude를 입력하면 셸이 PATH 주소록의 폴더들만 뒤지는데, 실제 설치 위치인 ~/.local/bin이 주소록에 없어 연결이 끊긴 구조와, PATH에 한 줄 추가하는 해결 명령](/images/insights/claude-code-install-errors/ko-path-explain.png)

### "EACCES" 또는 "permission denied"

- **상황**: `npm install -g`로 설치 중 권한 오류로 중단
- **원인**: npm이 사용자 소유가 아닌 폴더에 쓰기 시도. `sudo`로 우회 시 소유권이 꼬여 다음 문제로 이어지기 쉬워 공식적으로 비권장
- **대응법**: 네이티브 설치로 전환. 사용자 폴더에만 쓰기 때문에 권한 문제가 구조적으로 감소. 네이티브 설치에서도 권한 오류 발생 시 설치 폴더 소유자를 본인으로 되돌림: `sudo chown -R $(whoami) ~/.local`

### "Cask 'claude-code' is unavailable: No Cask with this name exists"

- **상황**: Homebrew로 `brew install --cask claude-code` 실행 시 설치 대상 없음으로 표시
- **원인**: 로컬에 저장된 Homebrew 목록이 오래돼서 새 패키지를 인식하지 못하는 상태
- **대응법**: 목록 갱신 후 재설치: `brew update && brew install --cask claude-code`

### "dyld: cannot load" 또는 "Symbol not found"

- **상황**: 설치나 실행 시 `dyld`로 시작하는 오류 또는 `Abort trap: 6` 발생
- **원인**: macOS 버전이 낮아 실행 파일과 비호환. Claude Code는 macOS 13.0 이상 요구
- **대응법**: 애플 메뉴의 "이 Mac에 관하여"에서 버전 확인 후 macOS 업데이트. Homebrew 등 다른 설치 방법도 같은 실행 파일을 받으므로 우회 불가

## Windows에서 클로드코드 설치 시 발생하는 오류와 해결법

### "'claude' is not recognized"

- **상황**: 설치 후 `claude` 입력 시 CMD에서는 `'claude' is not recognized as an internal or external command`, PowerShell에서는 `The term 'claude' is not recognized as the name of a cmdlet` 발생
- **원인**: macOS의 command not found와 동일한 PATH 문제. 설치 위치(`%USERPROFILE%\.local\bin`)가 PATH에 미등록
- **대응법**: PowerShell에서 아래 두 줄 실행 후 터미널 재시작

```powershell
$currentPath = [Environment]::GetEnvironmentVariable('PATH', 'User')
[Environment]::SetEnvironmentVariable('PATH', "$currentPath;$env:USERPROFILE\.local\bin", 'User')
```

### "'irm' is not recognized"

- **상황**: 설치 명령 붙여넣기 직후 명령 자체가 실행되지 않음
- **원인**: PowerShell용 명령을 CMD 창에 붙여넣음
- **대응법**: 시작 메뉴에서 "PowerShell" 검색해 열고 `irm https://claude.ai/install.ps1 | iex` 재실행

### "The token '&&' is not valid"

- **상황**: 설치 명령이 문법 오류로 실행되지 않음
- **원인**: 반대로 CMD용 명령을 PowerShell에 붙여넣음
- **대응법**: PowerShell용 명령(`irm https://claude.ai/install.ps1 | iex`)으로 교체 실행

### "'bash' is not recognized" 또는 "A parameter cannot be found that matches parameter name 'fsSL'"

- **상황**: 인터넷에서 복사한 설치 명령이 실행되지 않음
- **원인**: macOS/리눅스용 `curl ... | bash` 명령을 Windows에서 실행. PowerShell의 `curl`은 다른 프로그램의 별칭이라 동일 옵션 미지원
- **대응법**: Windows용 명령(`irm https://claude.ai/install.ps1 | iex`)으로 교체 실행

### "Claude Code on Windows requires either Git for Windows (for bash) or PowerShell"

- **상황**: 실행 시 Git 필요 오류로 보이는 메시지 발생
- **원인**: Git for Windows는 필수 아님. Claude Code는 Git Bash 부재 시 PowerShell 대체 사용, 이 오류는 둘 다 미발견을 의미
- **대응법**: 아래 셋 중 하나 진행
  - PowerShell 기본 위치(`C:\Windows\System32\WindowsPowerShell\v1.0\`)를 PATH에 추가
  - [git-scm.com](https://git-scm.com/downloads/win)에서 Git for Windows 설치, 설치 중 "Add to PATH" 선택 후 터미널 재시작
  - Git 기설치 시 settings.json에 `CLAUDE_CODE_GIT_BASH_PATH`로 bash.exe 경로 직접 지정

### "Claude Code does not support 32-bit Windows"

- **상황**: 64비트 PC인데도 32비트 미지원 오류 발생
- **원인**: 시작 메뉴의 `Windows PowerShell (x86)` 항목으로 실행 시 32비트 프로세스로 구동되어 오류 발생
- **대응법**: x86 미표기 `Windows PowerShell`을 열어 재실행. `[Environment]::Is64BitOperatingSystem`이 `False`로 나오는 진짜 32비트 Windows에서는 설치 불가

### "The process cannot access the file ... being used by another process"

- **상황**: PowerShell 설치 도중 파일 접근 오류로 실패
- **원인**: 이전 설치 시도가 아직 실행 중이거나, 백신 프로그램이 다운로드 중인 파일을 검사하며 점유 중인 상태
- **대응법**: 다른 PowerShell 창 모두 종료 및 백신 검사 완료 대기 후, 다운로드 폴더 삭제 및 재설치

```powershell
Remove-Item -Recurse -Force "$env:USERPROFILE\.claude\downloads"
irm https://claude.ai/install.ps1 | iex
```

## WSL과 리눅스에서 클로드코드 설치 시 발생하는 오류와 해결법

### "bash: claude: command not found"

- **상황**: 설치 후 `claude` 미실행
- **원인**: macOS 케이스와 동일한 PATH 문제
- **대응법**: `~/.bashrc`에 PATH 한 줄 추가

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### WSL에서 "exec: node: not found"

- **상황**: npm 방식으로 설치 후 `claude` 실행 시 node 미발견 오류
- **원인**: WSL이 리눅스용 Node 대신 Windows에 설치된 Node를 참조 중인 상태. `which node` 결과가 `/mnt/c/`로 시작하면 이 경우
- **대응법**: 리눅스 쪽에 Node 설치(배포판 패키지 매니저 또는 nvm). 설치 중 플랫폼 불일치 오류 시 `npm config set os linux` 선행 실행 후 재설치

### WSL에서 "cannot execute binary file: Exec format error"

- **상황**: 설치는 완료됐으나 실행 시 실행 파일 형식 오류 발생
- **원인**: WSL1의 알려진 호환성 문제
- **대응법**: PowerShell에서 WSL2로 전환: `wsl --set-version <배포판이름> 2`

### "Killed" 또는 "exit code 137"

- **상황**: 저사양 서버(VPS)에서 설치 도중 `Killed` 한 줄과 함께 중단
- **원인**: 메모리 부족으로 리눅스가 설치 프로세스 강제 종료. 설치에는 약 512MB의 여유 메모리 필요
- **대응법**: 스왑 공간 생성으로 메모리 보충 후 재설치

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### "Error loading shared library libstdc++.so.6"

- **상황**: 설치 후 실행 시 공유 라이브러리 미발견 오류
- **원인**: 시스템에 맞지 않는 실행 파일 변형이 설치됐거나, Alpine 같은 musl 계열 배포판에 필요한 패키지 부재
- **대응법**: `ldd --version`으로 시스템 종류 확인. Alpine이면 `apk add libgcc libstdc++ ripgrep`으로 패키지 설치, 일반(glibc) 시스템에서 이 오류 발생 시 삭제 후 재설치

## 모든 OS에서 공통으로 발생하는 오류와 해결법

### "npm: command not found" 또는 Node 버전 요구 오류

- **상황**: npm 방식(`npm install -g @anthropic-ai/claude-code`)으로 설치 시도 중 npm 부재 또는 Node 버전 미달 오류
- **원인**: npm 설치 방식은 Node.js 18 이상 요구. 커뮤니티에서는 실제로 20 이상 필요했다는 사례들 존재
- **대응법**: 네이티브 설치로 전환 시 Node.js 없이 설치 가능. npm 방식 유지 필요 시 [nodejs.org](https://nodejs.org)의 LTS 버전 또는 nvm으로 Node 20 이상 설치 후 재실행

### "syntax error near unexpected token '<'"

- **상황**: 한 줄 설치 명령 실행 시 이 문구 또는 `curl: (22) ... error: 403` 발생
- **원인**: 설치 스크립트 대신 HTML 페이지나 오류 응답 수신. 네트워크 문제, 지역 라우팅, 일시적 장애가 원인일 수 있음
- **대응법**: 몇 분 후 재시도, 또는 대안 설치(macOS는 `brew install --cask claude-code`, Windows는 `winget install Anthropic.ClaudeCode`) 사용. 지원 국가가 아니라는 안내 표시 시 해당 지역 설치 불가

### "unable to get local issuer certificate" 등 인증서 오류

- **상황**: 회사 컴퓨터에서 설치 시 TLS, SSL, 인증서 관련 오류 발생
- **원인**: 회사망의 보안 장비(프록시)가 통신에 개입 중인 상태
- **대응법**: IT 담당자에게 회사 인증서(CA) 파일 요청 후 설치 명령에 지정, 필요 시 `HTTPS_PROXY` 환경변수에 프록시 주소 설정. 환경마다 상이하므로 IT 담당자와 함께 확인이 가장 빠름

### "OAuth error: Invalid code"

- **상황**: 설치는 완료됐으나 로그인 단계에서 코드 무효 오류 발생
- **원인**: 로그인 코드 만료 또는 복사 중 잘림. 원격(SSH) 환경에서는 브라우저가 다른 컴퓨터에서 열리는 것이 원인일 수 있음
- **대응법**: Enter로 재시도 후 브라우저가 열리면 빠르게 완료. 브라우저 미실행 시 `c`를 눌러 URL 복사 후 직접 접속. 원격 환경이라면 터미널의 URL을 내 컴퓨터 브라우저에서 열고, 표시된 코드를 터미널에 붙여넣기

## 여기에 없는 오류를 만났을 때의 대응법

- **`claude doctor` 실행**: 설치가 절반이라도 된 상태라면 자동 진단 보고서 생성
- **중복 설치 확인**: npm 설치와 네이티브 설치가 함께 있으면 버전 충돌 가능. `which -a claude`로 확인 후 npm 쪽 제거(`npm uninstall -g @anthropic-ai/claude-code`)
- **오류 문구 그대로 검색**: 공식 GitHub 이슈에서 동일 문구로 검색 시 알려진 문제인지 확인 가능
- **데스크톱 앱 우회**: 터미널 설치가 계속 막히면 그래픽 화면으로 쓰는 Claude Code 데스크톱 앱(macOS, Windows)이 대안

**3줄 요약:**

- 2026년 7월 기준 공식 권장은 Node.js와 Git이 필요 없는 네이티브 한 줄 설치라서, npm 관련 오류(버전, 권한)는 설치 방식 전환으로 대부분 정리됩니다.
- 가장 흔한 `command not found`는 설치 실패가 아니라 PATH 미등록 문제이며, OS별 명령으로 PATH에 설치 위치를 추가하면 해결됩니다.
- Windows 오류는 CMD와 PowerShell 명령 혼동이 원인인 경우가 많고, Git for Windows는 필수가 아닙니다.

## Sources

- [Claude Code 공식 문서: 설치 및 로그인 문제 해결](https://code.claude.com/docs/en/troubleshoot-install)
- [Claude Code 공식 문서: 설치 가이드](https://code.claude.com/docs/en/setup)
- [Claude 고객센터: 설치와 인증 문제 해결](https://support.claude.com/en/articles/14552646-troubleshoot-claude-code-installation-and-authentication)
