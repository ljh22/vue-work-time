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

    bubble.addEventListener('mouseenter', () => {
      bubble.style.transform = 'translateY(-50%) scale(1.12)';
    });

    bubble.addEventListener('mouseleave', () => {
      bubble.style.transform = 'translateY(-50%)';
    });

    const icon = document.createElement('img');
    icon.src = chrome.runtime.getURL('workTime.png');
    icon.alt = '工时工具';
    icon.style.width = '100%';
    icon.style.height = '100%';
    icon.style.objectFit = 'cover';
    icon.style.borderRadius = '50%';

    bubble.appendChild(icon);

    bubble.title = '工时工具 - 点击打开';
    bubble.addEventListener('click', () => {
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
