/**
 * 전개도 탐험 퀴즈 메인 애플리케이션 상태 및 화면 관리자
 */

class QuizApp {
  constructor() {
    this.questions = quizData;
    this.currentIndex = 0;
    this.userAnswers = new Array(quizData.length).fill(null);
    this.score = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.isSubmitted = false;

    // DOM 요소를 캐시합니다.
    this.cacheDOM();
    // 이벤트 리스너 등록
    this.bindEvents();
  }

  cacheDOM() {
    // Pages
    this.pageMain = document.getElementById('page-main');
    this.pageQuiz = document.getElementById('page-quiz');
    this.pageResult = document.getElementById('page-result');

    // Main Elements
    this.btnStart = document.getElementById('btn-start');

    // Quiz Elements
    this.questionProgressText = document.getElementById('question-progress-text');
    this.progressBarInner = document.getElementById('progress-bar-inner');
    this.netContainer = document.getElementById('net-container');
    this.questionText = document.getElementById('question-text');
    this.choicesContainer = document.getElementById('choices-container');
    
    this.btnPrev = document.getElementById('btn-prev');
    this.btnNext = document.getElementById('btn-next');

    // Modal Elements
    this.modalSubmit = document.getElementById('modal-submit');
    this.btnModalCancel = document.getElementById('btn-modal-cancel');
    this.btnModalConfirm = document.getElementById('btn-modal-confirm');

    // Result Elements
    this.scoreCircleProgress = document.getElementById('score-circle-progress');
    this.scoreText = document.getElementById('score-text');
    this.correctCountEl = document.getElementById('correct-count');
    this.wrongCountEl = document.getElementById('wrong-count');
    this.btnReviewWrong = document.getElementById('btn-review-wrong');
    this.btnRestart = document.getElementById('btn-restart');
    this.wrongReviewContainer = document.getElementById('wrong-review-container');
    this.wrongCardList = document.getElementById('wrong-card-list');

    // Audio Toggle
    this.btnAudioToggle = document.getElementById('btn-audio-toggle');
  }

  bindEvents() {
    // 시작하기 버튼
    this.btnStart.addEventListener('click', () => {
      SoundSystem.playClick();
      this.goToQuiz(0);
    });

    // 이전 문제 버튼
    this.btnPrev.addEventListener('click', () => {
      if (this.currentIndex > 0) {
        SoundSystem.playClick();
        this.goToQuiz(this.currentIndex - 1, 'prev');
      }
    });

    // 다음/최종 제출 버튼
    this.btnNext.addEventListener('click', () => {
      SoundSystem.playClick();
      if (this.currentIndex < this.questions.length - 1) {
        this.goToQuiz(this.currentIndex + 1, 'next');
      } else {
        // 5번 문제에서 최종 제출 버튼 클릭 -> 모달 오픈
        this.openSubmitModal();
      }
    });

    // 모달 취소
    this.btnModalCancel.addEventListener('click', () => {
      SoundSystem.playClick();
      this.closeSubmitModal();
    });

    // 모달 확인 -> 최종 제출 및 채점
    this.btnModalConfirm.addEventListener('click', () => {
      SoundSystem.playSubmit();
      this.closeSubmitModal();
      this.calculateScoreAndShowResult();
    });

    // 틀린 문제 확인하기
    this.btnReviewWrong.addEventListener('click', () => {
      SoundSystem.playClick();
      this.toggleWrongReview();
    });

    // 다시 도전하기
    this.btnRestart.addEventListener('click', () => {
      SoundSystem.playClick();
      this.resetQuiz();
    });

    // 오디오 토글 버튼
    if (this.btnAudioToggle) {
      this.btnAudioToggle.addEventListener('click', () => {
        SoundSystem.muted = !SoundSystem.muted;
        this.btnAudioToggle.classList.toggle('muted', SoundSystem.muted);
        this.btnAudioToggle.setAttribute('aria-label', SoundSystem.muted ? '음소거 해제' : '음소거');
        this.btnAudioToggle.querySelector('.sound-icon').textContent = SoundSystem.muted ? '🔇' : '🔊';
      });
    }
  }

  // 화면 전환 (Fade / Slide 애니메이션)
  switchPage(activePage, direction = 'next') {
    const pages = [this.pageMain, this.pageQuiz, this.pageResult];
    
    pages.forEach(p => {
      if (p === activePage) {
        p.classList.remove('hidden', 'page-slide-left', 'page-slide-right');
        p.classList.add('page-active', 'fade-in');
      } else {
        p.classList.add('hidden');
        p.classList.remove('page-active', 'fade-in');
      }
    });
  }

  // 퀴즈 문제 화면으로 이동
  goToQuiz(index, slideDirection = 'next') {
    this.currentIndex = index;
    const currentQ = this.questions[this.currentIndex];

    // 페이지 활성화
    this.switchPage(this.pageQuiz, slideDirection);

    // Header 진행상황 갱신
    this.questionProgressText.textContent = `문제 ${this.currentIndex + 1} / ${this.questions.length}`;
    const progressPercent = ((this.currentIndex + 1) / this.questions.length) * 100;
    this.progressBarInner.style.width = `${progressPercent}%`;

    // 전개도 visual 렌더링
    NetRenderer.render(currentQ.netType, this.netContainer);

    // 문제 텍스트
    this.questionText.textContent = currentQ.question;

    // 보기 (4지선다) 생성
    this.choicesContainer.innerHTML = '';
    currentQ.choices.forEach((choiceText, cIdx) => {
      const optionCard = document.createElement('label');
      optionCard.className = 'choice-card';
      if (this.userAnswers[this.currentIndex] === cIdx) {
        optionCard.classList.add('selected');
      }

      const radioBtn = document.createElement('input');
      radioBtn.type = 'radio';
      radioBtn.name = `question-${currentQ.id}`;
      radioBtn.value = cIdx;
      radioBtn.checked = (this.userAnswers[this.currentIndex] === cIdx);

      radioBtn.addEventListener('change', () => {
        SoundSystem.playSelect();
        this.userAnswers[this.currentIndex] = cIdx;
        
        // 모든 choice-card 비선택 후 현재 선택 선택
        const allCards = this.choicesContainer.querySelectorAll('.choice-card');
        allCards.forEach(c => c.classList.remove('selected'));
        optionCard.classList.add('selected');
      });

      const indicator = document.createElement('span');
      indicator.className = 'choice-indicator';

      const labelText = document.createElement('span');
      labelText.className = 'choice-text';
      labelText.textContent = choiceText;

      optionCard.appendChild(radioBtn);
      optionCard.appendChild(indicator);
      optionCard.appendChild(labelText);

      this.choicesContainer.appendChild(optionCard);
    });

    // 이전 버튼 제어 (첫번째 문제에서는 비활성화/숨김)
    if (this.currentIndex === 0) {
      this.btnPrev.disabled = true;
      this.btnPrev.classList.add('disabled-btn');
    } else {
      this.btnPrev.disabled = false;
      this.btnPrev.classList.remove('disabled-btn');
    }

    // 다음/최종제출 버튼 텍스트 변경
    if (this.currentIndex === this.questions.length - 1) {
      this.btnNext.innerHTML = `<span>최종 제출</span> <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      this.btnNext.classList.add('btn-submit-highlight');
    } else {
      this.btnNext.innerHTML = `<span>다음</span> <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
      this.btnNext.classList.remove('btn-submit-highlight');
    }
  }

  // 모달 열기 / 닫기
  openSubmitModal() {
    this.modalSubmit.classList.remove('hidden');
    setTimeout(() => {
      this.modalSubmit.classList.add('active');
    }, 10);
  }

  closeSubmitModal() {
    this.modalSubmit.classList.remove('active');
    setTimeout(() => {
      this.modalSubmit.classList.add('hidden');
    }, 200);
  }

  // 채점 계산 및 결과 화면 표출
  calculateScoreAndShowResult() {
    this.isSubmitted = true;
    this.correctCount = 0;
    this.wrongCount = 0;

    this.questions.forEach((q, idx) => {
      if (this.userAnswers[idx] === q.answer) {
        this.correctCount++;
      } else {
        this.wrongCount++;
      }
    });

    // 개당 20점 (총 5문제 = 100점)
    this.score = this.correctCount * 20;

    // 페이지 switch
    this.switchPage(this.pageResult);

    // 원형 점수판 애니메이션 갱신
    this.animateCircularProgress(this.score);

    // 맞은/틀린 문제 수 표시
    this.correctCountEl.textContent = `${this.correctCount}개`;
    this.wrongCountEl.textContent = `${this.wrongCount}개`;

    // 오답노트 컨테이너 초기화 숨김
    this.wrongReviewContainer.classList.add('hidden');
    this.btnReviewWrong.textContent = '틀린 문제 확인하기 🔍';

    // 만점(100점)인 경우 축하 팡파르 및 폭죽 애니메이션
    if (this.score === 100) {
      setTimeout(() => SoundSystem.playFanfare(), 300);
      this.launchConfetti();
    }
  }

  // 원형 프로그레스 바 애니메이션
  animateCircularProgress(targetScore) {
    let currentScore = 0;
    const duration = 1200; // ms
    const startTime = performance.now();
    
    // SVG stroke-dashoffset 계산 (r = 70, C = 2 * PI * 70 = 439.82)
    const circumference = 2 * Math.PI * 70;
    this.scoreCircleProgress.style.strokeDasharray = circumference;
    this.scoreCircleProgress.style.strokeDashoffset = circumference;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      currentScore = Math.floor(easedProgress * targetScore);
      this.scoreText.textContent = `${currentScore}점`;

      const offset = circumference - (easedProgress * (targetScore / 100) * circumference);
      this.scoreCircleProgress.style.strokeDashoffset = offset;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.scoreText.textContent = `${targetScore}점`;
      }
    };

    requestAnimationFrame(animate);
  }

  // 오답 보기 토글 및 오답노트 카드 생성
  toggleWrongReview() {
    if (this.wrongReviewContainer.classList.contains('hidden')) {
      this.renderWrongReviewCards();
      this.wrongReviewContainer.classList.remove('hidden');
      this.btnReviewWrong.textContent = '오답 접기 🔼';
      this.wrongReviewContainer.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.wrongReviewContainer.classList.add('hidden');
      this.btnReviewWrong.textContent = '틀린 문제 확인하기 🔍';
    }
  }

  // 오답 카드 세부 생성
  renderWrongReviewCards() {
    this.wrongCardList.innerHTML = '';

    // 틀린 문제 스크리닝 (만점이면 전체 복습 모드로 표출)
    const wrongQuestions = this.questions.filter((q, idx) => this.userAnswers[idx] !== q.answer);

    if (wrongQuestions.length === 0) {
      this.wrongCardList.innerHTML = `
        <div class="all-correct-banner">
          <span class="banner-icon">🏆</span>
          <h3>우와! 100점 만점입니다!</h3>
          <p>모든 전개도 문제를 완벽하게 맞추셨어요. 공간 감각이 대단해요!</p>
        </div>
      `;
      return;
    }

    wrongQuestions.forEach((q) => {
      const originalIdx = q.id - 1;
      const userChoiceIdx = this.userAnswers[originalIdx];
      const userChoiceText = userChoiceIdx !== null ? q.choices[userChoiceIdx] : "선택하지 않음";
      const correctChoiceText = q.choices[q.answer];

      const card = document.createElement('div');
      card.className = 'wrong-card';
      card.innerHTML = `
        <div class="wrong-card-header">
          <span class="question-badge">문제 ${q.id}</span>
          <span class="shape-badge">${q.shapeName}</span>
        </div>
        <h4 class="wrong-card-question">${q.question}</h4>
        
        <div class="wrong-answers-comparison">
          <div class="ans-box user-ans">
            <span class="ans-label">내가 선택한 답:</span>
            <span class="ans-val wrong-text">❌ ${userChoiceText}</span>
          </div>
          <div class="ans-box correct-ans">
            <span class="ans-label">정답:</span>
            <span class="ans-val correct-text">✅ ${correctChoiceText}</span>
          </div>
        </div>

        <div class="wrong-explanation-box">
          <div class="exp-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <strong>친절한 해설</strong>
          </div>
          <p class="exp-content">${q.explanation}</p>
        </div>
      `;

      this.wrongCardList.appendChild(card);
    });
  }

  // 퀴즈 초기화 (다시 도전하기)
  resetQuiz() {
    this.currentIndex = 0;
    this.userAnswers = new Array(this.questions.length).fill(null);
    this.score = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.isSubmitted = false;

    this.switchPage(this.pageMain);
  }

  // 만점 기념 Confetti (폭죽) 애니메이션
  launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#4F8EF7', '#FFD54F', '#4CAF50', '#FF5722', '#E91E63', '#9C27B0'];

    for (let i = 0; i < 100; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 10 - 5
      });
    }

    let animationFrame;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activePieces = 0;

      pieces.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y < canvas.height) {
          activePieces++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (activePieces > 0) {
        animationFrame = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(animationFrame);
        canvas.remove();
      }
    };

    draw();
    setTimeout(() => {
      canvas.remove();
    }, 4000);
  }
}

// DOM 온로드 완료 후 시작
document.addEventListener('DOMContentLoaded', () => {
  window.app = new QuizApp();
});
