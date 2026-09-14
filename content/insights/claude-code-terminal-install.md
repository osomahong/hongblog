---
slug: claude-code-terminal-install
title: '클로드 코드 터미널 설치: 터미널이 처음인 분을 위한 화면 읽는 순서'
excerpt: >-
  클로드 코드 터미널 설치는 터미널 창을 열고 설치 명령 한 줄을 붙여 넣은 뒤 claude를 입력하는 세 단계입니다. 맥과 윈도우에서 창을
  여는 방법, 화면에 돌아오는 응답을 읽는 순서, PATH와 권한과 Node 버전으로 막힐 때 푸는 방법을 공식 문서 기준으로 정리했습니다.
category: AI_TECH
tags:
  - AI
  - 바이브코딩
  - 자동화
publishedAt: '2026-09-15T04:00:00.000Z'
highlights:
  - 윈도우에서는 설치 명령을 붙여 넣기 전에 줄 맨 앞의 PS를 보고 PowerShell 창인지 확인합니다.
  - >-
    claude 명령을 찾을 수 없다고 나오면 다시 설치하지 말고 PATH에 홈 폴더의 .local/bin을 추가한 뒤 터미널을 새로
    엽니다.
quiz:
  - question: 터미널에 claude를 입력했더니 명령을 찾을 수 없다고 나왔습니다. 가장 먼저 확인할 것은 무엇일까요?
    options:
      - 설치 파일이 들어가는 .local/bin 폴더가 PATH 목록에 있는지
      - Node.js 22 이상이 깔려 있는지
      - 클로드 요금제가 Pro 이상인지
      - 인터넷이 연결되어 있는지
    correctIndex: 0
    explanation: >-
      앤트로픽 공식 문제 해결 문서를 보면 이 오류는 설치 폴더가 PATH에 없을 때 나옵니다. 설치 스크립트로 깐 클로드 코드는
      Node.js를 쓰지 않고, 요금제와 네트워크 문제는 그다음 로그인 단계에서 드러납니다. 맥 기본 셸인 zsh에서는 설정 파일에 경로
      한 줄을 추가하고 터미널을 새로 열면 이 오류가 사라집니다.
metaTitle: '클로드 코드 터미널 설치: 터미널 처음 여는 분을 위한 순서'
metaDescription: >-
  클로드 코드 터미널 설치는 터미널 창을 열고 설치 명령 한 줄을 붙여 넣은 뒤 claude를 입력하는 세 단계입니다. 맥과 윈도우에서 창을
  여는 방법, 화면 읽는 순서, PATH와 권한과 Node 버전으로 막힐 때 푸는 방법을 담았습니다.
ogDescription: >-
  터미널 창을 여는 방법부터 설치 명령 한 줄, 화면에 돌아오는 응답을 읽는 법, PATH와 권한과 Node 버전으로 막힐 때 푸는 순서를
  공식 문서로 확인해 정리했습니다.
ogImage: /og/claude-code-terminal-install.png
summary3:
  - >-
    터미널은 마우스 대신 글로 명령을 받는 창이고, 맥에서는 Spotlight로 Terminal을, 윈도우에서는 Win + X 메뉴로
    PowerShell을 엽니다.
  - >-
    설치는 맥과 리눅스에서 claude.ai/install.sh를 bash로 넘기는 한 줄, 윈도우 PowerShell에서 irm과 iex를
    잇는 한 줄로 끝나고 화면에 Claude Code successfully installed 문구가 나옵니다.
  - >-
    claude 명령을 찾을 수 없다는 오류는 대부분 설치 폴더인 홈 폴더 아래 .local/bin이 PATH에 없어서 생기므로 셸 설정
    파일에 그 경로를 추가하고 터미널을 새로 엽니다.
---

클로드 코드 터미널 설치는 터미널 창을 열고 설치 명령 한 줄을 붙여 넣은 다음 `claude`를 입력하는 세 단계입니다. 앤트로픽 공식 안내에도 같은 순서로 적혀 있습니다. 실제로 걸리는 시간은 파일 내려받는 속도에 따라 달라집니다.

[클로드 코드(Claude Code)](/class/claude-code-for-everyone/what-is-claude-code) (클로드 코드가 무엇인지 설명한 글 바로가기)가 터미널에서 돌아가는 도구라는 사실은 이미 알고 계신 분이 많습니다. 설치 명령도 검색하면 한 줄로 나오고, 붙여 넣으라는 데까지 따라가기는 어렵지 않습니다.

정작 막히는 곳은 그 앞뒤입니다. 터미널 창을 어디에서 여는지, 명령을 넣은 뒤 쏟아지는 글자 가운데 무엇을 봐야 하는지, 화면에 아무 반응이 없는 것이 성공인지 실패인지가 안내에서 빠져 있습니다. 이 셋을 모르는 채로 시작하면 이미 끝난 설치를 실패로 오해해 같은 명령을 여러 번 돌리거나, 한 줄이면 풀릴 문제를 붙잡고 지웠다 깔았다를 반복하게 됩니다. 아래 명령과 사양은 2026년 9월 15일에 앤트로픽 공식 문서에서 확인한 내용입니다.

![맥 터미널 창에서 실행 중인 클로드 코드 화면. 위쪽에 Claude Code v2.0.0과 Sonnet 4.5 Claude Enterprise, 작업 폴더 경로가 세 줄로 적혀 있고 그 아래 입력한 요청과 클로드의 첫 응답, 주황색 진행 문구와 esc to interrupt 안내, 맨 아래에 꺾쇠 기호가 붙은 입력줄이 있다](/images/insights/claude-code-terminal-install/01-claude-code-first-screen.png)

위 그림은 앤트로픽 공식 저장소에 올라와 있는 시연 화면입니다. 설치를 마치고 `claude`를 입력한 뒤 첫 요청까지 보낸 상태이며, 화면에 보이는 버전은 촬영 시점 기준입니다.

## 터미널 창을 여는 곳: 맥과 윈도우

터미널(Terminal)은 버튼을 누르는 대신 글로 컴퓨터에 지시를 넣는 창입니다. 따로 내려받을 것은 없고, 맥과 윈도우에 처음부터 들어 있습니다.

- **맥**: `Command + Space`로 Spotlight 검색을 열고 `Terminal`을 입력한 뒤 엔터를 누릅니다.
- **윈도우**: `Win + X`를 누르고 메뉴에서 **Windows PowerShell** 또는 **Terminal**을 고릅니다.
- **리눅스**: `Ctrl + Alt + T`를 누르거나 프로그램 목록에서 터미널을 찾습니다.

윈도우에는 생김새가 비슷한 명령 창이 두 개 있습니다. PowerShell과 CMD인데 둘은 알아듣는 명령이 서로 다릅니다. 줄 맨 앞을 보면 구분할 수 있습니다. `PS C:\Users\이름>`처럼 앞에 `PS`가 붙어 있으면 PowerShell이고, `PS` 없이 `C:\Users\이름>`으로 시작하면 CMD입니다. 설치 명령이 다르므로 붙여 넣기 전에 어느 쪽 창인지 한 번 확인하시면 됩니다.

## 터미널 화면에서 먼저 읽어야 할 세 곳

창을 열면 글자 몇 줄과 깜빡이는 커서만 보입니다. 낯설어 보이지만 실제로 볼 곳은 세 군데뿐입니다.

우체국 창구 직원이 서류를 받을 준비가 되면 손을 내밀고 기다리듯, 터미널도 명령을 받을 준비가 되면 짧은 기호 하나를 줄 맨 앞에 띄워 둡니다. 이 기호가 **명령 프롬프트(prompt), 즉 지금 명령을 입력해도 된다는 표시**입니다. 모양은 셸(shell)마다 다릅니다. 셸은 입력한 명령을 받아 실행하는 프로그램입니다. 맥의 기본값인 zsh에서는 `%`, 리눅스의 bash에서는 `$`, 윈도우 PowerShell에서는 `>`가 나옵니다.

- **프롬프트 기호**: 이 기호가 보이면 명령을 입력할 수 있는 상태입니다. 새 프롬프트가 다시 나오지 않으면 앞 명령이 아직 돌아가는 중입니다.
- **기호 앞의 글자**: 지금 어느 폴더에서 작업하고 있는지 알려 줍니다. 맥은 `~` 하나가 홈 폴더를 뜻하고, 윈도우는 `C:\Users\이름` 같은 경로가 그대로 나옵니다.
- **깜빡이는 커서**: 앞으로 입력하는 글자가 들어갈 지점입니다. 터미널에서는 마우스로 커서를 옮길 수 없고 화살표 키를 씁니다.

처음 쓸 때 헷갈리기 쉬운 것이 두 가지 더 있습니다. 붙여넣기는 맥이 `Command + V`, 리눅스가 `Ctrl + Shift + V`, 윈도우 PowerShell이 `Ctrl + V` 또는 마우스 오른쪽 버튼입니다. `sudo`가 붙은 명령이나 Homebrew 설치처럼 맥 비밀번호를 묻는 명령에서는 입력해도 화면에 글자가 하나도 보이지 않습니다. 이것이 정상입니다. 그대로 치고 엔터를 누르시면 됩니다.

## 클로드 코드 설치 명령 한 줄과 화면에 돌아오는 응답

시작 전에 사양부터 확인합니다. 공식 문서 기준으로 macOS는 13.0 이상, 윈도우는 10 버전 1809 이상이나 Windows Server 2019 이상, 리눅스는 우분투 20.04 이상과 데비안 10 이상, 알파인 리눅스 3.19 이상입니다. 하드웨어는 메모리 4GB 이상에 x64 또는 ARM64 프로세서면 됩니다. 계정은 Pro와 Max, Team, Enterprise, Console 가운데 하나가 필요하고 무료 Claude.ai 플랜에는 클로드 코드 사용 권한이 들어 있지 않습니다. Amazon Bedrock이나 구글 클라우드의 에이전트 플랫폼, 마이크로소프트 파운드리 같은 외부 API 사업자를 연결해 쓰는 방법도 있습니다.

맥과 리눅스에서는 아래 한 줄을 붙여 넣고 엔터를 누릅니다.

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

윈도우 PowerShell에서는 명령이 다릅니다.

```powershell
irm https://claude.ai/install.ps1 | iex
```

CMD 창에서 시작하셨다면 다음 명령을 씁니다.

```batch
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

엔터를 누르면 글자가 여러 줄 지나갑니다. 전부 읽을 필요는 없고 끝에 `Claude Code successfully installed!`가 뜨면 설치가 끝난 것입니다.

창을 잘못 고른 경우에도 화면이 알려 줍니다. PowerShell에서 CMD용 명령을 넣으면 `The token '&&' is not a valid statement separator`가 나오고, CMD에서 PowerShell용 명령을 넣으면 `'irm' is not recognized as an internal or external command`가 나옵니다. 둘 다 맞는 창에서 명령을 다시 넣으면 됩니다.

설치가 끝났는지는 버전 번호로 확인합니다.

```bash
claude --version
```

`2.1.211 (Claude Code)`처럼 숫자와 `(Claude Code)`가 함께 나오면 정상입니다.

## claude를 입력한 뒤 처음 만나는 화면

작업할 폴더로 이동한 다음 `claude`를 입력합니다. `cd`는 폴더를 옮겨 가는 명령입니다.

```bash
cd ~/Documents/my-project
claude
```

처음 실행하면 로그인 안내가 뜨고 브라우저 창이 열립니다. 브라우저에서 클로드 계정으로 로그인하고 터미널로 돌아오면 인증이 끝나 있습니다.

글 맨 위 그림이 로그인을 마치고 첫 요청을 보낸 뒤의 화면입니다. 윗줄에 클로드 코드 버전, 그 아래에 쓰고 있는 모델 이름과 계정 종류, 그다음 줄에 지금 작업 중인 폴더 경로가 차례로 적혀 있습니다. 이 세 줄을 확인하는 습관을 들이면 엉뚱한 폴더에서 작업을 시키는 실수가 줄어듭니다. 그 아래 `>` 표시가 있는 줄이 메시지를 입력하는 곳입니다. 이 줄은 앞에서 본 셸 프롬프트가 아니라 클로드 코드가 따로 띄우는 입력줄이고, 여기서부터는 웹 채팅과 쓰는 방식이 거의 같습니다.

작업이 길어지면 화면이 이렇게 채워집니다.

![클로드 코드가 작업하는 중인 터미널 화면. 초록 점이 붙은 Search와 Read 줄마다 찾은 파일 수와 읽은 줄 수가 함께 표시되고, 아래쪽에 Running tests with coverage라는 진행 문구와 esc to interrupt 안내가 있다](/images/insights/claude-code-terminal-install/02-claude-code-working-screen.png)

이 화면을 읽는 방법은 단순합니다. 초록 점이 붙은 `Search`와 `Read` 줄은 클로드가 실제로 실행한 작업을 보여 주고, 바로 아래 한 칸 들어간 줄에 그 결과가 나옵니다. 회색 글씨는 넘겨도 되는 진행 안내이고, 색이 밝게 표시된 마지막 줄은 지금 하고 있는 일과 멈추는 방법을 알려 줍니다.

터미널 안에서 알아 둘 것은 네 가지입니다.

- 화면에 보이는 글자는 마우스로 누를 수 없습니다.
- 클로드가 작업하는 중에 멈추려면 `Esc`를 누릅니다.
- 클로드 코드를 끝낼 때는 `exit`를 입력하거나 빈 입력줄에서 `Ctrl + D`를 두 번 칩니다.
- 쓸 수 있는 명령을 보려면 `/help`를 입력합니다.

## 명령이 제대로 실행됐는지 어떻게 알 수 있나요?

터미널을 처음 쓸 때 자주 하는 오해가 하나 있습니다. 명령을 넣었는데 화면에 아무 말도 없이 프롬프트만 다시 뜨면 실패했다고 생각하게 됩니다. 창구에 서류를 제대로 내면 직원이 따로 설명하지 않고 다음 사람을 부르듯, 터미널도 명령이 문제없이 끝나면 조용히 프롬프트만 되돌려 줍니다. **터미널에서 아무 말이 없는 것은 대체로 잘 끝났다는 뜻입니다.**

반대로 잘못된 것이 있으면 화면에 그 내용이 문장으로 뜹니다. 설치 단계에서 자주 나오는 문구는 아래와 같습니다.

| 화면에 나오는 문장 | 뜻 |
|---|---|
| `zsh: command not found: claude` | 맥에서 claude 실행 파일을 찾지 못했습니다 |
| `bash: claude: command not found` | 리눅스에서 나오는 같은 오류입니다 |
| `'claude' is not recognized as an internal or external command` | 윈도우 CMD에서 나오는 같은 오류입니다 |
| `claude : The term 'claude' is not recognized as the name of a cmdlet` | 윈도우 PowerShell에서 나오는 같은 오류입니다 |

위 네 문구는 앤트로픽 공식 문제 해결 문서가 운영체제별로 정리해 둔 것입니다.

권한이 모자라 설치가 멈추는 경우는 이 표에 없고 같은 문서의 권한 오류 항목에서 따로 다룹니다. 파일을 넣을 폴더에 쓸 권한이 없다는 뜻이고, 푸는 방법은 아래 권한 항목에 적어 두었습니다.

설치와 설정 상태는 아래 명령 하나로 확인합니다.

```bash
claude doctor
```

이 명령은 설치 상태와 설정 파일 오류, 마지막 자동 갱신 결과를 확인해 화면에 보여 주기만 합니다. 아무것도 바꾸지 않으므로 막혔을 때 먼저 돌려 봐도 안전합니다.

## 설치가 막히는 곳 세 군데: PATH, 권한, Node 버전

### PATH: claude 명령을 찾지 못할 때

설치는 끝났는데 `claude`를 입력하면 명령을 찾을 수 없다고 나오는 경우가 흔합니다. 프로그램이 지워진 것이 아니라 설치된 실행 파일을 셸이 찾지 못한 상태입니다. 셸은 PATH라는 목록에 적힌 폴더만 위에서부터 차례로 찾아보고, 목록에 없는 폴더는 들여다보지 않습니다. 설치 파일은 맥과 리눅스에서 `~/.local/bin/claude`, 윈도우에서 `%USERPROFILE%\.local\bin\claude.exe`에 들어가는데, 이 파일이 들어 있는 폴더가 목록에 없으면 셸이 찾지 못합니다.

맥과 리눅스에서 목록에 들어 있는지 확인하는 명령입니다.

```bash
echo $PATH | tr ':' '\n' | grep -Fx "$HOME/.local/bin"
```

아무것도 나오지 않으면 목록에 없는 것이므로 셸 설정 파일에 한 줄을 추가합니다. 맥 기본 셸인 zsh 기준입니다.

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

리눅스에서 bash를 쓰신다면 `~/.zshrc` 대신 `~/.bashrc`에 같은 내용을 넣습니다. 윈도우 PowerShell에서는 아래 두 줄을 넣고 창을 닫았다가 다시 엽니다.

```powershell
$currentPath = [Environment]::GetEnvironmentVariable('PATH', 'User')
[Environment]::SetEnvironmentVariable('PATH', "$currentPath;$env:USERPROFILE\.local\bin", 'User')
```

PATH를 고쳤는데도 같은 오류가 나오면 `~/.local/bin/claude` 파일이 실제로 있는지 확인합니다. 파일이 없으면 설치가 끝나지 않은 것이므로 설치 명령부터 다시 실행합니다.

### 권한: 쓸 수 없는 폴더를 만났을 때

설치 프로그램은 맥과 리눅스에서 `~/.local/bin/`과 `~/.claude/`에 파일을 쓸 수 있어야 합니다. 두 폴더가 잠겨 있으면 설치가 권한 오류로 멈춥니다. 아래 명령으로 지금 상태를 확인합니다.

```bash
test -w ~/.local/bin && echo "writable" || echo "not writable"
test -w ~/.claude && echo "writable" || echo "not writable"
```

`not writable`이 나오면 폴더를 만들고 소유자를 본인 계정으로 돌려놓습니다.

```bash
sudo mkdir -p ~/.local/bin
sudo chown -R $(whoami) ~/.local
```

npm으로 깔다가 권한 오류가 났다면 `sudo`를 붙여 다시 시도하지 않는 편이 안전합니다. 공식 문서에도 `sudo npm install -g`는 쓰지 말고 앞의 설치 스크립트 방식으로 바꾸라고 적혀 있습니다.

### Node 버전: npm으로 깔 때만 걸리는 조건

설치 방법을 검색하면 `npm install -g @anthropic-ai/claude-code`가 함께 나와서 Node.js를 먼저 깔아야 한다고 생각하기 쉽습니다. 하지만 앞에서 소개한 설치 스크립트로 깔면 클로드 코드는 자체 실행 파일로 돌아가고 Node.js를 쓰지 않습니다.

Node.js가 필요한 경우는 npm 방식으로 깔 때이고, 2.1.198 버전부터는 Node.js 22 이상을 요구합니다. Node.js 22보다 낮은 버전에서는 설치가 멈추지 않고 `EBADENGINE` 경고만 뜬 채 끝납니다. 경고가 떠도 설치는 완료되고 `claude` 명령도 그대로 실행됩니다. npm이 받아 오는 것 역시 Node로 돌아가는 프로그램이 아니라 운영체제에 맞는 실행 파일이어서 그렇습니다.

처음이라면 설치 스크립트 쪽을 권합니다. 이 방식으로 깐 클로드 코드는 새 버전이 나오면 따로 명령을 넣지 않아도 갱신됩니다.

## 운영체제별 상세 절차와 터미널을 열지 않는 방법

터미널 화면을 읽는 순서는 여기까지입니다. Homebrew와 Git 같은 사전 도구까지 포함한 설치 절차는 운영체제별로 따로 정리해 두었습니다.

- [맥 설치 9단계](/insights/claude-code-mac-easy-setup-guide) (Homebrew와 Git 준비부터 한국어 설정까지 바로가기)
- [윈도우 설치 순서](/insights/claude-code-windows-easy-setup-guide) (winget 설치와 작업 폴더 만들기 바로가기)
- [설치 오류 메시지 모음](/insights/claude-code-install-errors) (운영체제별 오류 문구와 해결법 바로가기)
- [CLI 뜻 정리](/insights/cli-meaning-claude-code-guide) (명령줄 인터페이스가 무엇인지 바로가기)

검은 창을 계속 쓰고 싶지 않은 분에게는 다른 방법이 두 가지 있습니다. 하나는 VS Code 확장이고 다른 하나는 데스크톱 앱입니다. 앤트로픽은 클로드 코드 데스크톱 앱을 맥과 윈도우용으로 내놓고 있고, 리눅스는 우분투 22.04 이상과 데비안 12 이상에서 apt로 까는 베타 단계입니다. 이 앱에서는 터미널 없이 같은 작업을 맡길 수 있습니다. VS Code 쪽은 [맥 확장 설치](/insights/install-claude-code-vscode-mac)와 [윈도우 확장 설치](/insights/install-claude-code-vscode-windows)에 화면과 함께 정리해 두었습니다.

## 자주 묻는 질문

### 터미널에서 명령을 잘못 치면 컴퓨터가 망가지나요?

이 글에 적은 명령으로는 그런 일이 생기지 않습니다. 설치 명령은 앤트로픽이 배포하는 스크립트를 내려받아 바로 실행하고, 확인 명령은 상태를 보여 주기만 합니다. 권한 항목의 `sudo` 두 줄도 홈 폴더 아래 설치 폴더를 만들고 소유자를 본인 계정으로 되돌릴 뿐입니다. 오타가 있으면 명령을 찾을 수 없다는 문장이 나오고 아무 일도 일어나지 않습니다. 다만 뜻을 모르는 채로 인터넷에서 본 `sudo` 명령을 그대로 붙여 넣는 것은 조심해야 합니다.

### 맥 비밀번호를 입력하는데 화면에 아무것도 보이지 않습니다. 고장인가요?

정상입니다. 맥 터미널은 보안을 위해 비밀번호를 칠 때 별표나 점도 표시하지 않습니다. 화면이 멈춘 것처럼 보여도 입력은 들어가고 있으니 그대로 치고 엔터를 누르시면 됩니다.

### 설치한 클로드 코드는 어떻게 최신 버전으로 올리나요?

설치 스크립트로 깔았다면 따로 할 일이 없습니다. 클로드 코드가 시작할 때와 실행 중에 새 버전을 확인하고 받아 두었다가 다음 실행에 적용합니다. 지금 바로 올리고 싶으면 `claude update`를 입력합니다. Homebrew나 winget으로 깔았다면 기본값이 수동 갱신이라 `brew upgrade claude-code`나 `winget upgrade Anthropic.ClaudeCode`를 직접 실행합니다. Homebrew에서 `claude-code@latest` 캐스크를 깔았다면 그 이름으로 올립니다. `CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE`를 1로 두면 클로드 코드가 갱신 명령을 대신 돌려 줍니다.

## 3줄 요약

- 터미널은 마우스 대신 글로 명령을 받는 창이고, 맥에서는 Spotlight로 Terminal을, 윈도우에서는 `Win + X` 메뉴로 PowerShell을 엽니다.
- 설치는 맥과 리눅스에서 `curl -fsSL https://claude.ai/install.sh | bash`, 윈도우 PowerShell에서 `irm https://claude.ai/install.ps1 | iex` 한 줄이며 끝나면 `Claude Code successfully installed!`가 나옵니다.
- claude 명령을 찾을 수 없다는 오류는 대부분 설치 폴더인 `~/.local/bin`이 PATH에 없어서 생기므로, 셸 설정 파일에 그 경로를 추가하고 터미널을 새로 엽니다.

## Sources

- [Claude Code 터미널 입문 안내](https://code.claude.com/docs/en/terminal-guide)
- [Claude Code 설치와 시스템 요구 사항](https://code.claude.com/docs/en/setup)
- [Claude Code 설치와 로그인 문제 해결](https://code.claude.com/docs/en/troubleshoot-install)
- [Claude Code 빠른 시작](https://code.claude.com/docs/en/quickstart)
- [Claude Code 공식 저장소](https://github.com/anthropics/claude-code)
