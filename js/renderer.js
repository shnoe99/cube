/**
 * 전개도 그래픽 및 3D 접기 시뮬레이터 렌더러
 */

const NetRenderer = {
  // 전개도 렌더링 함수
  render: function(netType, container) {
    container.innerHTML = '';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'net-visual-wrapper';
    
    // 2D 전개도 SVG 카드
    const svgContainer = document.createElement('div');
    svgContainer.className = 'net-svg-container';
    svgContainer.innerHTML = this.getSVGContent(netType);
    wrapper.appendChild(svgContainer);

    // 3D 시뮬레이션 인터랙티브 컨트롤 영역
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'net-controls';
    
    const foldBtn = document.createElement('button');
    foldBtn.type = 'button';
    foldBtn.className = 'btn-fold-toggle';
    foldBtn.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
      <span>3D 입체로 접어보기 🧊</span>
    `;

    const stage3D = document.createElement('div');
    stage3D.className = 'net-3d-stage hidden';
    stage3D.innerHTML = this.get3DHTML(netType);

    let is3d = false;
    foldBtn.addEventListener('click', () => {
      is3d = !is3d;
      if (is3d) {
        svgContainer.classList.add('hidden');
        stage3D.classList.remove('hidden');
        foldBtn.classList.add('active');
        foldBtn.querySelector('span').textContent = '2D 전개도 도면 보기 📐';
        setTimeout(() => {
          const shape = stage3D.querySelector('.shape-3d');
          if (shape) shape.classList.add('folded');
        }, 50);
      } else {
        const shape = stage3D.querySelector('.shape-3d');
        if (shape) shape.classList.remove('folded');
        setTimeout(() => {
          stage3D.classList.add('hidden');
          svgContainer.classList.remove('hidden');
          foldBtn.classList.remove('active');
          foldBtn.querySelector('span').textContent = '3D 입체로 접어보기 🧊';
        }, 300);
      }
    });

    controlsDiv.appendChild(foldBtn);
    wrapper.appendChild(controlsDiv);
    wrapper.appendChild(stage3D);

    container.appendChild(wrapper);
  },

  // 2D SVG 그래픽 도면 생성
  getSVGContent: function(netType) {
    switch (netType) {
      case 'cube_standard':
        return `
          <svg viewBox="0 0 400 320" width="100%" height="100%" class="net-svg">
            <defs>
              <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="#4F8EF7" flood-opacity="0.15"/>
              </filter>
            </defs>
            <g transform="translate(60, 20)" filter="url(#shadow)">
              <!-- 십자형 정육면체 전개도 (1-4-1 형태) -->
              <!-- Top face -->
              <rect x="70" y="10" width="70" height="70" rx="4" fill="#E3F2FD" stroke="#4F8EF7" stroke-width="2.5"/>
              <text x="105" y="50" font-size="16" font-weight="bold" fill="#1E88E5" text-anchor="middle">상</text>
              
              <!-- Middle row 4 faces -->
              <rect x="0" y="80" width="70" height="70" rx="4" fill="#E3F2FD" stroke="#4F8EF7" stroke-width="2.5"/>
              <text x="35" y="120" font-size="16" font-weight="bold" fill="#1E88E5" text-anchor="middle">좌</text>

              <rect x="70" y="80" width="70" height="70" rx="4" fill="#BBDEFB" stroke="#4F8EF7" stroke-width="2.5"/>
              <text x="105" y="120" font-size="16" font-weight="bold" fill="#1565C0" text-anchor="middle">전</text>

              <rect x="140" y="80" width="70" height="70" rx="4" fill="#E3F2FD" stroke="#4F8EF7" stroke-width="2.5"/>
              <text x="175" y="120" font-size="16" font-weight="bold" fill="#1E88E5" text-anchor="middle">우</text>

              <rect x="210" y="80" width="70" height="70" rx="4" fill="#E3F2FD" stroke="#4F8EF7" stroke-width="2.5"/>
              <text x="245" y="120" font-size="16" font-weight="bold" fill="#1E88E5" text-anchor="middle">후</text>

              <!-- Bottom face -->
              <rect x="70" y="150" width="70" height="70" rx="4" fill="#E3F2FD" stroke="#4F8EF7" stroke-width="2.5"/>
              <text x="105" y="190" font-size="16" font-weight="bold" fill="#1E88E5" text-anchor="middle">하</text>

              <!-- 접는 선 (점선) 표시 -->
              <line x1="70" y1="80" x2="140" y2="80" stroke="#1565C0" stroke-width="2" stroke-dasharray="5,4"/>
              <line x1="70" y1="150" x2="140" y2="150" stroke="#1565C0" stroke-width="2" stroke-dasharray="5,4"/>
              <line x1="70" y1="80" x2="70" y2="150" stroke="#1565C0" stroke-width="2" stroke-dasharray="5,4"/>
              <line x1="140" y1="80" x2="140" y2="150" stroke="#1565C0" stroke-width="2" stroke-dasharray="5,4"/>
              <line x1="210" y1="80" x2="210" y2="150" stroke="#1565C0" stroke-width="2" stroke-dasharray="5,4"/>

              <!-- 직각 및 길이 표시 표시 -->
              <text x="140" y="245" font-size="14" fill="#5C6BC0" font-weight="600" text-anchor="middle">모든 면이 동일한 정사각형 6개</text>
            </g>
          </svg>
        `;

      case 'cuboid_opposite':
        return `
          <svg viewBox="0 0 420 320" width="100%" height="100%" class="net-svg">
            <g transform="translate(40, 20)">
              <!-- 직육면체 전개도 (면 가~바 기호 표기) -->
              <!-- Top cap -->
              <rect x="100" y="10" width="100" height="50" rx="4" fill="#FFF9C4" stroke="#FBC02D" stroke-width="2.5"/>
              <text x="150" y="40" font-size="18" font-weight="bold" fill="#F57F17" text-anchor="middle">면 (나)</text>

              <!-- Main strip of 4 faces -->
              <!-- 면 가 (색칠 강조) -->
              <rect x="0" y="60" width="100" height="90" rx="4" fill="#FFE082" stroke="#FF8F00" stroke-width="3.5"/>
              <rect x="4" y="64" width="92" height="82" rx="2" fill="none" stroke="#FF6F00" stroke-width="1.5" stroke-dasharray="4,3"/>
              <text x="50" y="112" font-size="20" font-weight="900" fill="#D84315" text-anchor="middle">★ 면 (가)</text>

              <!-- 면 다 -->
              <rect x="100" y="60" width="100" height="90" rx="4" fill="#E3F2FD" stroke="#4F8EF7" stroke-width="2.5"/>
              <text x="150" y="112" font-size="18" font-weight="bold" fill="#1565C0" text-anchor="middle">면 (다)</text>

              <!-- 면 라 -->
              <rect x="200" y="60" width="100" height="90" rx="4" fill="#E8F5E9" stroke="#4CAF50" stroke-width="2.5"/>
              <text x="250" y="112" font-size="18" font-weight="bold" fill="#2E7D32" text-anchor="middle">면 (라)</text>

              <!-- 면 마 -->
              <rect x="300" y="60" width="35" height="90" rx="4" fill="#F3E5F5" stroke="#AB47BC" stroke-width="2.5"/>
              <text x="317.5" y="112" font-size="14" font-weight="bold" fill="#6A1B9A" text-anchor="middle">마</text>

              <!-- Bottom cap -->
              <rect x="100" y="150" width="100" height="50" rx="4" fill="#FFF9C4" stroke="#FBC02D" stroke-width="2.5"/>
              <text x="150" y="182" font-size="18" font-weight="bold" fill="#F57F17" text-anchor="middle">면 (바)</text>

              <!-- 접는 선들 -->
              <line x1="100" y1="60" x2="100" y2="150" stroke="#FF8F00" stroke-width="2" stroke-dasharray="5,4"/>
              <line x1="200" y1="60" x2="200" y2="150" stroke="#1565C0" stroke-width="2" stroke-dasharray="5,4"/>
              <line x1="300" y1="60" x2="300" y2="150" stroke="#2E7D32" stroke-width="2" stroke-dasharray="5,4"/>
              <line x1="100" y1="60" x2="200" y2="60" stroke="#FBC02D" stroke-width="2" stroke-dasharray="5,4"/>
              <line x1="100" y1="150" x2="200" y2="150" stroke="#FBC02D" stroke-width="2" stroke-dasharray="5,4"/>

              <text x="175" y="240" font-size="15" fill="#E65100" font-weight="bold" text-anchor="middle">💡 '면 (가)'와 마주보는 면을 찾아보세요!</text>
            </g>
          </svg>
        `;

      case 'triangular_prism':
        return `
          <svg viewBox="0 0 400 300" width="100%" height="100%" class="net-svg">
            <g transform="translate(50, 30)">
              <!-- 삼각기둥 전개도 -->
              <!-- Top Triangle Base -->
              <polygon points="130,20 70,80 190,80" fill="#E1BEE7" stroke="#8E24AA" stroke-width="2.5" stroke-linejoin="round"/>
              <text x="130" y="65" font-size="14" font-weight="bold" fill="#4A148C" text-anchor="middle">밑면 1</text>

              <!-- 3 Side Rectangles -->
              <rect x="10" y="80" width="60" height="120" rx="3" fill="#E3F2FD" stroke="#4F8EF7" stroke-width="2.5"/>
              <text x="40" y="145" font-size="14" font-weight="bold" fill="#1565C0" text-anchor="middle">옆면 1</text>

              <rect x="70" y="80" width="120" height="120" rx="3" fill="#BBDEFB" stroke="#4F8EF7" stroke-width="2.5"/>
              <text x="130" y="145" font-size="15" font-weight="bold" fill="#0D47A1" text-anchor="middle">옆면 2</text>

              <rect x="190" y="80" width="60" height="120" rx="3" fill="#E3F2FD" stroke="#4F8EF7" stroke-width="2.5"/>
              <text x="220" y="145" font-size="14" font-weight="bold" fill="#1565C0" text-anchor="middle">옆면 3</text>

              <!-- Bottom Triangle Base -->
              <polygon points="130,260 70,200 190,200" fill="#E1BEE7" stroke="#8E24AA" stroke-width="2.5" stroke-linejoin="round"/>
              <text x="130" y="225" font-size="14" font-weight="bold" fill="#4A148C" text-anchor="middle">밑면 2</text>

              <!-- 접는 선 -->
              <line x1="70" y1="80" x2="70" y2="200" stroke="#8E24AA" stroke-width="2" stroke-dasharray="5,4"/>
              <line x1="190" y1="80" x2="190" y2="200" stroke="#8E24AA" stroke-width="2" stroke-dasharray="5,4"/>
              <line x1="70" y1="80" x2="190" y2="80" stroke="#8E24AA" stroke-width="2" stroke-dasharray="5,4"/>
              <line x1="70" y1="200" x2="190" y2="200" stroke="#8E24AA" stroke-width="2" stroke-dasharray="5,4"/>
            </g>
          </svg>
        `;

      case 'square_pyramid':
        return `
          <svg viewBox="0 0 400 320" width="100%" height="100%" class="net-svg">
            <g transform="translate(60, 20)">
              <!-- 사각뿔 전개도 (중앙 사각형 + 4개 삼각형) -->
              <!-- Base Square -->
              <rect x="90" y="90" width="100" height="100" rx="3" fill="#FFE082" stroke="#FF8F00" stroke-width="2.5"/>
              <text x="140" y="145" font-size="15" font-weight="bold" fill="#E65100" text-anchor="middle">사각 밑면</text>

              <!-- Top Triangle -->
              <polygon points="140,10 90,90 190,90" fill="#C8E6C9" stroke="#388E3C" stroke-width="2.5" stroke-linejoin="round"/>
              <text x="140" y="65" font-size="13" font-weight="bold" fill="#1B5E20" text-anchor="middle">옆면 1</text>

              <!-- Bottom Triangle -->
              <polygon points="140,270 90,190 190,190" fill="#C8E6C9" stroke="#388E3C" stroke-width="2.5" stroke-linejoin="round"/>
              <text x="140" y="220" font-size="13" font-weight="bold" fill="#1B5E20" text-anchor="middle">옆면 2</text>

              <!-- Left Triangle -->
              <polygon points="10,140 90,90 90,190" fill="#C8E6C9" stroke="#388E3C" stroke-width="2.5" stroke-linejoin="round"/>
              <text x="60" y="145" font-size="13" font-weight="bold" fill="#1B5E20" text-anchor="middle">옆면 3</text>

              <!-- Right Triangle -->
              <polygon points="270,140 190,90 190,190" fill="#C8E6C9" stroke="#388E3C" stroke-width="2.5" stroke-linejoin="round"/>
              <text x="220" y="145" font-size="13" font-weight="bold" fill="#1B5E20" text-anchor="middle">옆면 4</text>

              <!-- 접는 선 (밑면 테두리 점선) -->
              <rect x="90" y="90" width="100" height="100" fill="none" stroke="#2E7D32" stroke-width="2" stroke-dasharray="5,4"/>
            </g>
          </svg>
        `;

      case 'invalid_cube':
        return `
          <svg viewBox="0 0 400 320" width="100%" height="100%" class="net-svg">
            <g transform="translate(40, 20)">
              <!-- 오류 전개도 (접었을 때 면이 겹치는 형태) -->
              <!-- 일렬로 4개 + 같은 쪽에 2개가 붙어있는 오류 패턴 -->
              <rect x="20" y="80" width="65" height="65" rx="3" fill="#FFCDD2" stroke="#E53935" stroke-width="2.5"/>
              <text x="52.5" y="118" font-size="15" font-weight="bold" fill="#B71C1C" text-anchor="middle">면 1</text>

              <rect x="85" y="80" width="65" height="65" rx="3" fill="#FFCDD2" stroke="#E53935" stroke-width="2.5"/>
              <text x="117.5" y="118" font-size="15" font-weight="bold" fill="#B71C1C" text-anchor="middle">면 2</text>

              <rect x="150" y="80" width="65" height="65" rx="3" fill="#FFCDD2" stroke="#E53935" stroke-width="2.5"/>
              <text x="182.5" y="118" font-size="15" font-weight="bold" fill="#B71C1C" text-anchor="middle">면 3</text>

              <rect x="215" y="80" width="65" height="65" rx="3" fill="#FFCDD2" stroke="#E53935" stroke-width="2.5"/>
              <text x="247.5" y="118" font-size="15" font-weight="bold" fill="#B71C1C" text-anchor="middle">면 4</text>

              <!-- 같은 위쪽에 면 2개가 겹쳐 배치됨 (오류 원인) -->
              <rect x="85" y="15" width="65" height="65" rx="3" fill="#FF8A80" stroke="#D50000" stroke-width="3"/>
              <text x="117.5" y="52" font-size="14" font-weight="900" fill="#880E4F" text-anchor="middle">면 5 ⚠️</text>

              <rect x="150" y="15" width="65" height="65" rx="3" fill="#FF8A80" stroke="#D50000" stroke-width="3"/>
              <text x="182.5" y="52" font-size="14" font-weight="900" fill="#880E4F" text-anchor="middle">면 6 ⚠️</text>

              <!-- 접는 선 -->
              <line x1="85" y1="80" x2="215" y2="80" stroke="#B71C1C" stroke-width="2" stroke-dasharray="4,4"/>
              <line x1="85" y1="80" x2="85" y2="145" stroke="#B71C1C" stroke-width="2" stroke-dasharray="4,4"/>
              <line x1="150" y1="80" x2="150" y2="145" stroke="#B71C1C" stroke-width="2" stroke-dasharray="4,4"/>
              <line x1="215" y1="80" x2="215" y2="145" stroke="#B71C1C" stroke-width="2" stroke-dasharray="4,4"/>

              <!-- 오류 경고 문구 -->
              <text x="160" y="180" font-size="14" fill="#D32F2F" font-weight="bold" text-anchor="middle">⚠️ 한쪽 윗면에만 2개의 면이 치우쳐 있습니다!</text>
              <text x="160" y="205" font-size="13" fill="#795548" text-anchor="middle">접었을 때 면이 겹치고 반대쪽 면이 뚫리게 됩니다.</text>
            </g>
          </svg>
        `;

      default:
        return `<div class="net-placeholder">전개도 도면</div>`;
    }
  },

  // 3D 접기 시뮬레이션 HTML 구조 생성 (CSS 3D Transform 사용)
  get3DHTML: function(netType) {
    return `
      <div class="cube-3d-scene">
        <div class="shape-3d ${netType}">
          <div class="face-3d face-base"><span>밑면</span></div>
          <div class="face-3d face-front"><span>앞면</span></div>
          <div class="face-3d face-back"><span>뒷면</span></div>
          <div class="face-3d face-left"><span>왼쪽</span></div>
          <div class="face-3d face-right"><span>오른쪽</span></div>
          <div class="face-3d face-top"><span>윗면</span></div>
        </div>
      </div>
      <p class="hint-3d-text">💡 3D 모델을 마우스로 드래그하거나 접기 모션을 관찰하세요!</p>
    `;
  }
};
