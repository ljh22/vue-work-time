(() => {
  const BUBBLE_ID = '__work_time_extension_bubble__';

  const init = () => {
    if (document.getElementById(BUBBLE_ID)) {
      return;
    }

    // 不在扩展自身页面内展示
    const extensionOrigin = chrome.runtime.getURL('');
    if (window.location.href.startsWith(extensionOrigin)) {
      return;
    }

    const bubble = document.createElement('div');
    bubble.id = BUBBLE_ID;
    bubble.style.position = 'fixed';
    bubble.style.top = '50%';
    bubble.style.right = '10px';
    bubble.style.transform = 'translateY(-50%)';
    bubble.style.width = '40px';
    bubble.style.height = '40px';
    bubble.style.borderRadius = '50%';
    bubble.style.display = 'flex';
    bubble.style.alignItems = 'center';
    bubble.style.justifyContent = 'center';
    bubble.style.cursor = 'pointer';
    bubble.style.zIndex = '2147483647';
    bubble.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
    bubble.style.padding = '4px';
    bubble.style.userSelect = 'none';

    // 拖拽逻辑变量
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialTop = 0;
    let initialRight = 0;
    let hasMoved = false;

    bubble.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = bubble.getBoundingClientRect();
      initialTop = rect.top;
      initialRight = window.innerWidth - rect.right;
      
      bubble.style.transition = 'none';
      hasMoved = false;
      // 阻止事件冒泡和默认行为，防止拖拽时触发点击或文本选择
      e.preventDefault();
      e.stopPropagation();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const deltaX = startX - e.clientX;
      const deltaY = e.clientY - startY;

      // 移动阈值判断，防止轻微抖动被判定为移动
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        hasMoved = true;
      }

      let newTop = initialTop + deltaY;
      let newRight = initialRight + deltaX;

      // 边界限制
      const bubbleSize = 40;
      newTop = Math.max(0, Math.min(window.innerHeight - bubbleSize, newTop));
      newRight = Math.max(0, Math.min(window.innerWidth - bubbleSize, newRight));

      bubble.style.top = `${newTop}px`;
      bubble.style.right = `${newRight}px`;
      bubble.style.transform = 'none'; // 移除之前的居中偏移
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      bubble.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
    });

    bubble.addEventListener('mouseenter', () => {
      if (!isDragging) {
        bubble.style.transform = bubble.style.transform === 'none' ? 'scale(1.12)' : 'translateY(-50%) scale(1.12)';
      }
    });

    bubble.addEventListener('mouseleave', () => {
      if (!isDragging) {
        bubble.style.transform = bubble.style.transform === 'none' ? 'none' : 'translateY(-50%)';
      }
    });

    const icon = document.createElement('img');
    icon.src = chrome.runtime.getURL('workTime.png');
    icon.alt = '工时工具';
    icon.style.width = '100%';
    icon.style.height = '100%';
    icon.style.objectFit = 'cover';
    icon.style.borderRadius = '50%';
    icon.style.pointerEvents = 'none'; // 确保图片不干扰拖拽

    bubble.appendChild(icon);

    bubble.title = '工时工具 - 点击打开 (可拖拽挪动)';
    bubble.addEventListener('click', (e) => {
      // 如果发生过明显的移动，则不触发点击事件
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      chrome.runtime.sendMessage({ type: 'open-work-time-tab' });
    });

    document.body.appendChild(bubble);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
